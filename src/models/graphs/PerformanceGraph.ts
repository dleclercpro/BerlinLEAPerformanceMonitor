import Graph from './Graph';
import TimeDuration, { TimeUnit } from '../TimeDuration';

interface Performance {
    time: Date,
    duration: TimeDuration,
}

class PerformanceGraph extends Graph<Performance> {

    public async draw(data: Performance[]) {
        const t0 = data[0].time.getTime();

        const xUnit = TimeUnit.Minutes;
        const yUnit = TimeUnit.Seconds;

        const opts = {
            title: 'Nutzer-Session auf der LEA-Seite im Laufe der Zeit',
            xAxisLabel: `Verbrachte Zeit seit Anfang der Session (${xUnit})`,
            yAxisLabel: `Dauer (${yUnit})`,
        };

        const lines = [{
            label: `Dauer`,
            data: data.map(d => {
                const t = d.time.getTime();

                return {
                    x: new TimeDuration(t - t0, TimeUnit.Milliseconds).to(xUnit).getAmount(),
                    y: d.duration.to(yUnit).getAmount(),
                };
            }),
            color: 'red',
        }];

        await this.generate(lines, opts);
    }
}

export default PerformanceGraph;