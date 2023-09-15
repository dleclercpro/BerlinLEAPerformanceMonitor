import { ChartType } from 'chart.js';
import Graph from './Graph';
import TimeDuration, { TimeUnit } from '../TimeDuration';
import { LOCALE } from '../../config';

interface SessionData {
    start: Date,
    duration: TimeDuration,
}

class SessionDurationGraph extends Graph<SessionData> {

    public async draw(data: SessionData[]) {
        const yUnit = TimeUnit.Seconds;

        const start = data[0].start;

        const opts = {
            type: 'line' as ChartType,
            title: `Länge einer User-Session auf der Seite des Berliner LEAs bis zum Misserfolg (Start: ${start.toLocaleString(LOCALE)})`,
            xAxisLabel: `Zeit`,
            yAxisLabel: `Dauer (${yUnit})`,
        };

        const datasets = [{
            label: `Länge der User-Session`,
            color: 'red',
            data: data.map((d: SessionData) => {
                return {
                    x: d.start.getTime(),
                    y: d.duration.to(yUnit).getAmount(),
                };
            }),
        }];

        await this.generate(datasets, opts);
    }
}

export default SessionDurationGraph;