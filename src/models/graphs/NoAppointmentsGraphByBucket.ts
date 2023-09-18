import SessionHistory from '../sessions/SessionHistory';
import { WEEKDAYS } from '../../constants';
import { Locale, Weekday } from '../../types';
import { LONG_DATE_TIME_FORMAT_OPTIONS, WEEKDAY_COLORS } from '../../config';
import { formatDate, translateWeekday } from '../../utils/locale';
import NoAppointmentsGraph from './NoAppointmentsGraph';
import { getAverage } from '../../utils/math';
import { GraphDataset, GraphOptions } from './Graph';
import { ChartType } from 'chart.js';
import CompleteSession from '../sessions/CompleteSession';
import logger from '../../logger';
import TimeDuration, { TimeUnit } from '../TimeDuration';

const sessionFilter = (session: CompleteSession) => (
    // Ignore unreasonably long sessions
    session.isDurationReasonable() &&
    // Only consider sessions that ended with 'keine Termine frei' error message
    session.foundNoAppointment()
);

/**
 * This graph shows how long it takes a user to reach the 'keine Termine frei'
 * message using buckets.
 */
class NoAppointmentsGraphByBucket extends NoAppointmentsGraph {

    protected generateOptions(history: SessionHistory): GraphOptions {
        if (history.getSize() < 2) throw new Error('Not enough data to plot graph.');
        
        const start = history.getEarliestSession()!.getStartTime();
        const end = history.getLatestSession()!.getEndTime();
        
        return {
            ...super.generateOptions(history),
            type: 'line' as ChartType,
            title: [
                `Durchnittliche Länge einer User-Session auf der Seite des Berliner LEAs, bis zur Fehlermeldung 'Es sind keine Termine frei.'`,
                `Bucket-Größe: ${history.getBucketSize().format()}`,
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
            const buckets = history.getBucketsByWeekday(weekday)
                // Remove empty buckets
                .filter(bucket => {
                    return bucket.content.filter(sessionFilter).length > 0;
                });

            const data = buckets
                .map(bucket => {
                    const sessions = bucket.content.filter(sessionFilter);
                    
                    return {
                        x: bucket.startTime.to(this.xAxisUnit).getAmount(),
                        y: getAverage(sessions.map(session => session.getDuration().to(this.yAxisUnit).getAmount())),
                    };
                });

            // Daily graph: first and last point (midnight) should be equal
            if (data.length > 0) {
                data.push({ x: 24, y: data[0].y });
            }

            return {
                label: translateWeekday(weekday, Locale.DE),
                color: WEEKDAY_COLORS[i],
                data,
            };
        });
    }
}

export default NoAppointmentsGraphByBucket;