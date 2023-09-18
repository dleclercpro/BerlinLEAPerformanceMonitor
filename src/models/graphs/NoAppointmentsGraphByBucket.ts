import TimeDuration, { TimeUnit } from '../TimeDuration';
import { getTimeSpentSinceMidnight } from '../../utils/time';
import SessionHistory from '../sessions/SessionHistory';
import { FIVE_MINUTES, ONE_DAY, TEN_MINUTES, WEEKDAYS } from '../../constants';
import { Locale } from '../../types';
import { LONG_DATE_TIME_FORMAT_OPTIONS, WEEKDAY_COLORS } from '../../config';
import { formatDate, translateWeekday } from '../../utils/locale';
import NoAppointmentsGraph from './NoAppointmentsGraph';
import CompleteSession from '../sessions/CompleteSession';
import { getAverage, getRange } from '../../utils/math';
import { GraphDataset, GraphOptions } from './Graph';
import { ChartType } from 'chart.js';

interface SessionBucket {
    startTime: TimeDuration,
    endTime: TimeDuration,
    sessions: CompleteSession[],
}

/**
 * This graph shows how long it takes a user to reach the 'keine Termine frei'
 * message using buckets.
 */
class NoAppointmentsGraphByBucket extends NoAppointmentsGraph {
    protected bucketSize: TimeDuration = TEN_MINUTES;

    protected generateOptions(history: SessionHistory): GraphOptions {
        if (history.size() < 2) throw new Error('Not enough data to plot graph.');
        
        const start = history.getEarliestSession()!.getStartTime();
        const end = history.getLatestSession()!.getEndTime();
        
        return {
            ...super.generateOptions(history),
            type: 'line' as ChartType,
            title: [
                `Durchnittliche Länge einer User-Session auf der Seite des Berliner LEAs, bis zur Fehlermeldung 'Es sind keine Termine frei.'`,
                `Bucket-Größe: ${this.bucketSize.format()}`,
                `Start: ${formatDate(start, LONG_DATE_TIME_FORMAT_OPTIONS)}`,
                `End: ${formatDate(end, LONG_DATE_TIME_FORMAT_OPTIONS)}`,
            ],
        };
    }

    protected generateDatasetOptions(args: GraphDataset) {
        return {
            ...super.generateDatasetOptions(args),
            borderWidth: 2,
            pointRadius: 2,
        };
    }

    protected generateDatasets(history: SessionHistory) {
        return WEEKDAYS.map((weekday, i) => {
            const sessions = history.getSessionsByWeekday(weekday)
                .filter(session => {
                    return (
                        // Ignore sessions that are unreasonably long (>5m)
                        session.isDurationReasonable() &&
                        // Only consider sessions that ended with 'keine Termine frei' error message
                        session.foundNoAppointment()
                    );
                });

            // Build session buckets
            const bucketSizeMs = this.bucketSize.toMs().getAmount();
            const bucketCount = ONE_DAY.toMs().getAmount() / bucketSizeMs;
            
            const buckets = getRange(bucketCount).map(i => {
                const bucketSessions: CompleteSession[] = [];

                const startTime = new TimeDuration(i * bucketSizeMs, TimeUnit.Milliseconds);
                const endTime = new TimeDuration((i + 1) * bucketSizeMs, TimeUnit.Milliseconds);

                sessions.forEach(session => {
                    const sessionStartTime = getTimeSpentSinceMidnight(session.getStartTime()).toMs();
                    const sessionEndTime = getTimeSpentSinceMidnight(session.getEndTime()).toMs();

                    if ((startTime.getAmount() <= sessionStartTime.getAmount()) && (sessionEndTime.getAmount() < endTime.getAmount())) {
                        bucketSessions.push(session);
                    }
                });

                return {
                    startTime,
                    endTime,
                    sessions: bucketSessions,
                } as SessionBucket;
            });

            return {
                label: translateWeekday(weekday, Locale.DE),
                color: WEEKDAY_COLORS[i],
                data: buckets
                    // Remove empty buckets
                    .filter(bucket => bucket.sessions.length > 0)
                    .map(bucket => {
                        return {
                            x: bucket.startTime.to(TimeUnit.Hours).getAmount(),
                            y: getAverage(bucket.sessions.map(session => session.getDuration().to(this.yAxisUnit).getAmount())),
                        };
                    }),
            };
        });
    }
}

export default NoAppointmentsGraphByBucket;