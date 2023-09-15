import Graph from './Graph';
import TimeDuration, { TimeUnit } from '../TimeDuration';
import { LOCALE } from '../../config';

interface Performance {
    start: Date,
    duration: TimeDuration,
}

class PerformanceGraph extends Graph<Performance> {

    public async draw(data: Performance[]) {
        const yUnit = TimeUnit.Seconds;

        const start = data[0].start;

        const opts = {
            title: `Länge einer User-Session auf der Seite des Berliner LEAs (Start: ${start.toLocaleString(LOCALE)})`,
            xAxisLabel: `Zeit`,
            yAxisLabel: `Dauer (${yUnit})`,
        };

        const lines = [{
            label: `Länge der Session`,
            data: data.map((d: Performance) => {
                return {
                    x: d.start.getTime(),
                    y: d.duration.to(yUnit).getAmount(),
                };
            }),
            color: 'red',
        }];

        await this.generate(lines, opts);
    }
}

export default PerformanceGraph;