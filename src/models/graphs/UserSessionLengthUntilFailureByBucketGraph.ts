import SessionHistory from '../sessions/SessionHistory';
import { WEEKDAYS } from '../../constants/times';
import { GraphAxes, Locale, TimeUnit } from '../../types';
import { WEEKDAY_COLORS } from '../../config/styles';
import { formatDate, translateWeekday } from '../../utils/locale';
import { getAverage } from '../../utils/math';
import Graph from './Graph';
import { ChartType, Color as ChartColor } from 'chart.js';
import CompleteSession from '../sessions/CompleteSession';
import SessionBucket from '../buckets/SessionBucket';
import { LONG_DATE_TIME_FORMAT_OPTIONS } from '../../config/locale';
import { NotEnoughDataError } from '../../errors';

const noAppointmentSessionFilter = (session: CompleteSession) => {
    // Only consider sessions that ended with 'keine Termine frei' error message
    return session.foundNoAppointment();
}

const bucketFilter = (bucket: SessionBucket) => {
    // Remove empty buckets
    // return bucket.getSessions(noAppointmentSessionFilter).length > 0;

    return true;
}

/**
 * This graph shows how long it takes a user to reach the 'keine Termine frei'
 * message using buckets.
 */
class UserSessionLengthUntilFailureByBucketGraph extends Graph<SessionHistory> {
    protected name: string = 'UserSessionLengthUntilFailureByBucket';
    protected type: ChartType = 'line';
    protected axes: GraphAxes = {
        x: { label: `Tageszeit`, unit: TimeUnit.Hours, min: 0, max: 24 },
        y: { label: `Dauer`, unit: TimeUnit.Seconds },
    };

    public async draw(history: SessionHistory) {
        if (history.getSize() < 2) throw new NotEnoughDataError('Not enough data to plot graph.');

        const start = history.getEarliestSession()!.getStartTime();
        const end = history.getLatestSession()!.getEndTime();

        this.title = [
            `Durchnittliche Länge einer User-Session auf der Seite des Berliner LEAs, bis zur Fehlermeldung 'Es sind keine Termine frei.'`,
            `Bucket-Größe: ${history.getBucketSize().format()}`,
            `Start: ${formatDate(start, LONG_DATE_TIME_FORMAT_OPTIONS)}`,
            `Ende: ${formatDate(end, LONG_DATE_TIME_FORMAT_OPTIONS)}`,
        ];

        await super.draw(history);
    }

    protected generateDatasets(history: SessionHistory) {
        return WEEKDAYS.map((weekday, i) => {
            const buckets = history.getBucketsByWeekday(weekday)
                .filter(bucketFilter);

            const data = buckets
                .map(bucket => {
                    const sessions = bucket.getSessions(noAppointmentSessionFilter);
                    const sessionDurations = sessions.map(session => session.getDuration().to(this.axes.y.unit as TimeUnit).getAmount());

                    return {
                        x: bucket.getStartTime().to(this.axes.x.unit as TimeUnit).getAmount(),
                        y: sessions.length > 0 ? getAverage(sessionDurations) : NaN,
                    };
                });

            // Daily graph: first and last point (midnight) should be equal
            if (data.length > 0) {
                data.push({ x: 24, y: data[0].y });
            }

            return {
                data,
                label: translateWeekday(weekday, Locale.DE),
                color: WEEKDAY_COLORS[i],
            };
        });
    }

    protected generateDatasetOptions(label: string, color: ChartColor) {
        return {
            ...super.generateDatasetOptions(label, color),
            borderWidth: 2,
            pointRadius: 2,
        };
    }
}

export default UserSessionLengthUntilFailureByBucketGraph;