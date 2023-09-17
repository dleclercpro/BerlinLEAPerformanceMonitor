import { ChartType } from 'chart.js';
import Graph from './Graph';
import { TimeUnit } from '../TimeDuration';
import { formatDate, getTimeSpentSinceMidnight, translateWeekday } from '../../utils/time';
import SessionHistory from '../sessions/SessionHistory';
import { FIVE_MINUTES, WEEKDAYS } from '../../constants';
import { Locale } from '../../types';
import CompleteSession from '../sessions/CompleteSession';
import { NoAppointmentsError } from '../../errors';
import { WEEKDAY_COLORS } from '../../config';

const isSessionLengthReasonable = (session: CompleteSession) => {
    return session.getDuration().smallerThan(FIVE_MINUTES);
}

/**
 * This graph shows how long it takes a user to reach the 'keine Termine frei'
 * message on an hourly basis.
 */
class NoAppointmentsGraph extends Graph<SessionHistory> {
    protected xAxisUnit = null;
    protected yAxisUnit = TimeUnit.Seconds;

    protected generateOptions(history: SessionHistory) {
        if (history.size() < 2) throw new Error('Not enough data to plot graph.');
        
        const start = history.getEarliestSession()!.getStartTime();
        const end = history.getLatestSession()!.getEndTime();

        return {
            type: 'scatter' as ChartType,
            title: [
                `Länge einer User-Session auf der Seite des Berliner LEAs, bis zur Fehlmeldung 'Es sind keine Termine frei.'`,
                `Start: ${formatDate(start)}`,
                `End: ${formatDate(end)}`,
            ],
            xMin: 0,
            xMax: 24,
            xAxisLabel: `Tageszeit (h)`,
            yAxisLabel: `Dauer (${this.yAxisUnit})`,
        };
    }

    protected generateDatasets(history: SessionHistory) {
        return WEEKDAYS.map((weekday, i) => {
            const sessions = history.getSessionsByWeekday(weekday)
                .filter(session => {
                    const errors = session.getErrors();

                    return (
                        // Ignore sessions that are unreasonably long (>5m)
                        isSessionLengthReasonable(session) &&
                        // Ignore sessions that did not end with a 'keine Termine frei' message
                        errors.length === 1 &&
                        errors[0] === NoAppointmentsError.name
                    );
                });

            return {
                label: translateWeekday(weekday, Locale.DE),
                color: WEEKDAY_COLORS[i],
                data: sessions.map(session => {
                    return {
                        x: getTimeSpentSinceMidnight(session.getStartTime()).to(TimeUnit.Hours).getAmount(),
                        y: session.getDuration().to(this.yAxisUnit).getAmount(),
                    };
                }),
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