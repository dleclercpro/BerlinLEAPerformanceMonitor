import { ChartType } from 'chart.js';
import Graph, { GraphBaseOptions } from './Graph';
import { getTimeSpentSinceMidnight } from '../../utils/time';
import SessionHistory from '../sessions/SessionHistory';
import { WEEKDAYS } from '../../constants/times';
import { Locale, TimeUnit } from '../../types';
import { WEEKDAY_COLORS } from '../../config';
import { translateWeekday } from '../../utils/locale';
import CompleteSession from '../sessions/CompleteSession';

const IGNORE_LENGTHY_SESSIONS = true;

export const sessionFilterNoAppointmentsGraph = (session: CompleteSession) => (
    // Only consider sessions that ended with 'keine Termine frei' error message
    session.foundNoAppointment(IGNORE_LENGTHY_SESSIONS)
);

/**
 * This graph shows how long it takes a user to reach the 'keine Termine frei'
 * message on an hourly basis.
 */
class NoAppointmentsGraph extends Graph<SessionHistory> {
    protected xAxisUnit = TimeUnit.Hours;
    protected yAxisUnit = TimeUnit.Seconds;

    protected generateDatasets(history: SessionHistory) {
        return WEEKDAYS.map((weekday, i) => {
            const sessions = history.getSessionsByWeekday(weekday)
                .filter(sessionFilterNoAppointmentsGraph);

            const data = sessions.map(session => {
                return {
                    x: getTimeSpentSinceMidnight(session.getStartTime()).to(this.xAxisUnit).getAmount(),
                    y: session.getDuration().to(this.yAxisUnit).getAmount(),
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
            type: 'scatter' as ChartType,
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
}

export default NoAppointmentsGraph;