import { ChartType } from 'chart.js';
import Graph, { GraphOptions } from './Graph';
import { TimeUnit } from '../TimeDuration';
import { getTimeSpentSinceMidnight } from '../../utils/time';
import SessionHistory from '../sessions/SessionHistory';
import { WEEKDAYS } from '../../constants';
import { Locale } from '../../types';
import { LONG_DATE_TIME_FORMAT_OPTIONS, WEEKDAY_COLORS } from '../../config';
import { formatDate, translateWeekday } from '../../utils/locale';
import CompleteSession from '../sessions/CompleteSession';

const sessionFilter = (session: CompleteSession) => (
    // Ignore unreasonably long sessions
    session.isDurationReasonable() &&
    // Only consider sessions that ended with 'keine Termine frei' error message
    session.foundNoAppointment()
);

/**
 * This graph shows how long it takes a user to reach the 'keine Termine frei'
 * message on an hourly basis.
 */
class NoAppointmentsGraph extends Graph<SessionHistory> {
    protected xAxisUnit = TimeUnit.Hours;
    protected yAxisUnit = TimeUnit.Seconds;

    protected generateOptions(history: SessionHistory): GraphOptions {
        if (history.getSize() < 2) throw new Error('Not enough data to plot graph.');
        
        const start = history.getEarliestSession()!.getStartTime();
        const end = history.getLatestSession()!.getEndTime();

        return {
            type: 'scatter' as ChartType,
            title: [
                `Länge einer User-Session auf der Seite des Berliner LEAs, bis zur Fehlermeldung 'Es sind keine Termine frei.'`,
                `Start: ${formatDate(start, LONG_DATE_TIME_FORMAT_OPTIONS)}`,
                `End: ${formatDate(end, LONG_DATE_TIME_FORMAT_OPTIONS)}`,
            ],
            axes:{
                x: {
                    label: `Tageszeit (h)`,
                    min: 0,
                    max: 24,
                },
                y: {
                    label: `Dauer (${this.yAxisUnit})`,
                },
            },
        };
    }

    protected generateDatasets(history: SessionHistory) {
        return WEEKDAYS.map((weekday, i) => {
            const sessions = history.getSessionsByWeekday(weekday)
                .filter(sessionFilter);

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

            return {
                label: translateWeekday(weekday, Locale.DE),
                color: WEEKDAY_COLORS[i],
                data,
            };
        });
    }

    public async draw(history: SessionHistory) {
        const options = this.generateOptions(history);
        const datasets = this.generateDatasets(history);

        await this.generate(datasets, options);
    }
}

export default NoAppointmentsGraph;