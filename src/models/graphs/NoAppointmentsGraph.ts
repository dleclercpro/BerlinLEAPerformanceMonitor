import { ChartType } from 'chart.js';
import Graph, { GraphOptions } from './Graph';
import { TimeUnit } from '../TimeDuration';
import { getTimeSpentSinceMidnight } from '../../utils/time';
import SessionHistory from '../sessions/SessionHistory';
import { FIVE_MINUTES, WEEKDAYS } from '../../constants';
import { Locale } from '../../types';
import CompleteSession from '../sessions/CompleteSession';
import { NoAppointmentsError } from '../../errors';
import { LONG_DATE_TIME_FORMAT_OPTIONS, WEEKDAY_COLORS } from '../../config';
import { formatDate, translateWeekday } from '../../utils/locale';

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

    protected generateOptions(history: SessionHistory): GraphOptions {
        if (history.size() < 2) throw new Error('Not enough data to plot graph.');
        
        const start = history.getEarliestSession()!.getStartTime();
        const end = history.getLatestSession()!.getEndTime();

        return {
            type: 'scatter' as ChartType,
            title: [
                `Länge einer User-Session auf der Seite des Berliner LEAs, bis zur Fehlmeldung 'Es sind keine Termine frei.'`,
                `Start: ${formatDate(start, LONG_DATE_TIME_FORMAT_OPTIONS)}`,
                `End: ${formatDate(end, LONG_DATE_TIME_FORMAT_OPTIONS)}`,
            ],
            axes:{
                x: {
                    label: `Tageszeit (h)`,
                    min: 0,
                    max: 0,
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