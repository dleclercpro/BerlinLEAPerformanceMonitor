import SessionHistory from '../sessions/SessionHistory';
import { WEEKDAYS } from '../../constants/times';
import { Locale, TimeUnit } from '../../types';
import { WEEKDAY_COLORS } from '../../config';
import { translateWeekday } from '../../utils/locale';
import { getAverage } from '../../utils/math';
import Graph, { GraphDatasetOptions, GraphBaseOptions } from './Graph';
import { ChartType } from 'chart.js';
import CompleteSession from '../sessions/CompleteSession';
import SessionBucket from '../buckets/SessionBucket';

const sessionFilter = (session: CompleteSession) => (
    // Only consider sessions that ended with 'keine Termine frei' error message
    session.foundNoAppointment()
);

const bucketFilter = (bucket: SessionBucket) => {
    // Remove empty buckets
    // return bucket.content.filter(sessionFilter).length > 0;

    return true;
}

/**
 * This graph shows how long it takes a user to reach the 'keine Termine frei'
 * message using buckets.
 */
class UserSessionLengthUntilFailureBucketGraph extends Graph<SessionHistory> {
    protected name: string = 'UserSessionLengthUntilFailureBucket';
    protected xAxisUnit = TimeUnit.Hours;
    protected yAxisUnit = TimeUnit.Seconds;

    protected generateDatasets(history: SessionHistory) {
        return WEEKDAYS.map((weekday, i) => {
            const buckets = history.getBucketsByWeekday(weekday)
                .filter(bucketFilter);

            const data = buckets
                .map(bucket => {
                    const sessions = bucket.getSessions().filter(sessionFilter);
                    
                    return {
                        x: bucket.getStartTime().to(this.xAxisUnit).getAmount(),
                        y: sessions.length > 0 ? (
                            getAverage(sessions.map(session => session.getDuration().to(this.yAxisUnit).getAmount()))
                        ) : NaN,
                    };
                });

            // Daily graph: first and last point (midnight) should be equal
            if (data.length > 0) {
                data.push({ x: 24, y: data[0].y });
            }

            return data;
        });
    }

    protected generateDatasetOptions(history: SessionHistory) {
        return WEEKDAYS.map((weekday, i) => {
            return {
                label: translateWeekday(weekday, Locale.DE),
                color: WEEKDAY_COLORS[i],
            };
        });
    }

    protected generateBaseOptions(title: string[]): GraphBaseOptions {
        return {
            type: 'line' as ChartType,
            title,
            axes:{
                x: {
                    label: `Tageszeit (${this.xAxisUnit})`,
                    min: 0,
                    max: 24,
                },
                y: {
                    label: `Dauer (${this.yAxisUnit})`,
                },
            },
        };
    }

    protected fillDatasetOptions(args: GraphDatasetOptions) {
        return {
            ...super.fillDatasetOptions(args),
            borderWidth: 2,
            pointRadius: 2,
        };
    }
}

export default UserSessionLengthUntilFailureBucketGraph;