import SessionHistory from '../sessions/SessionHistory';
import { WEEKDAYS } from '../../constants';
import { Locale } from '../../types';
import { LONG_DATE_TIME_FORMAT_OPTIONS, WEEKDAY_COLORS } from '../../config';
import { formatDate, translateWeekday } from '../../utils/locale';
import NoAppointmentsGraph from './NoAppointmentsGraph';
import { getAverage } from '../../utils/math';
import { GraphDataset, GraphOptions } from './Graph';
import { ChartType } from 'chart.js';
import CompleteSession from '../sessions/CompleteSession';

const sessionFilter = (session: CompleteSession) => (
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
                    return bucket.sessions.filter(sessionFilter).length > 0;
                });

            return {
                label: translateWeekday(weekday, Locale.DE),
                color: WEEKDAY_COLORS[i],
                data: buckets
                    .map(bucket => {
                        const sessions = bucket.sessions.filter(sessionFilter);
                        
                        return {
                            x: bucket.startTime.to(this.xAxisUnit).getAmount(),
                            y: getAverage(sessions.map(session => session.getDuration().to(this.yAxisUnit).getAmount())),
                        };
                    }),
            };
        });
    }
}

export default NoAppointmentsGraphByBucket;