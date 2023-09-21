import SessionHistory from '../sessions/SessionHistory';
import { WEEKDAYS } from '../../constants/times';
import { GraphAxes, Locale, TimeUnit } from '../../types';
import { WEEKDAY_COLORS } from '../../config/styles';
import { formatDate, translateWeekday } from '../../utils/locale';
import { getAverage } from '../../utils/math';
import Graph from './Graph';
import { ChartType, Color as ChartColor } from 'chart.js';
import CompleteSession from '../sessions/CompleteSession';
import { LONG_DATE_TIME_FORMAT_OPTIONS } from '../../config/locale';

const wasSessionFailure = (session: CompleteSession) => {
    return session.wasFailure() && session.isDurationReasonable();
}



class SessionAverageLengthGraph extends Graph<SessionHistory> {
    protected type: ChartType = 'line';
    protected axes: GraphAxes = {
        x: { label: `Tageszeit`, unit: TimeUnit.Hours, min: 0, max: 24 },
        y: { label: `Dauer`, unit: TimeUnit.Seconds },
    };

    public async draw(history: SessionHistory) {
        const start = history.getEarliestSession()!.getStartTime();
        const end = history.getLatestSession()!.getEndTime();

        const sessionCount = history.getSessions(wasSessionFailure).length;

        this.title = [
            `Durchschnittliche Länge einer User-Session auf der LEA-Seite`,
            `Start: ${formatDate(start, LONG_DATE_TIME_FORMAT_OPTIONS)} | Ende: ${formatDate(end, LONG_DATE_TIME_FORMAT_OPTIONS)}`,
            `Anzahl der User-Sessions: ${sessionCount}`,
            `Bucket-Größe: ${history.getBucketSize().format()}`,
        ];

        await super.draw(history);
    }

    protected generateDatasets(history: SessionHistory) {
        return WEEKDAYS.map((weekday, i) => {
            const buckets = history.getBucketsByWeekday(weekday);

            const data = buckets
                .map(bucket => {
                    const sessions = bucket.getSessions(wasSessionFailure);
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

export default SessionAverageLengthGraph;