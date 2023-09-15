import Graph from './Graph';
import TimeDuration, { TimeUnit } from '../TimeDuration';
import logger from '../../logger';

interface Performance {
    time: number,
    duration: TimeDuration,
}

class PerformanceGraph extends Graph<Performance> {

    public async draw(data: Performance[]) {
        const t0 = data[0].time;

        const xUnit = TimeUnit.Minutes;
        const yUnit = TimeUnit.Seconds;

        const opts = {
            title: 'Nutzer-Session auf der LEA-Seite im Laufe der Zeit',
            xAxisLabel: `Verbrachte Zeit seit Anfang der Session (${xUnit})`,
            yAxisLabel: `Dauer (${yUnit})`,
        };

        const lines = [{
            label: `Dauer`,
            data: data.map(d => ({
                x: new TimeDuration(d.time - t0, TimeUnit.Milliseconds).to(xUnit).getAmount(),
                y: d.duration.to(yUnit).getAmount(),
            })),
            color: 'red',
        }];

        await this.generate(lines, opts);
    }
}

export default PerformanceGraph;