import { ChartType } from 'chart.js';
import Graph from './Graph';
import { TimeUnit } from '../TimeDuration';
import { formatDate } from '../../utils/time';
import CompleteSession from '../sessions/CompleteSession';

class NoAppointmentsSessionLengthGraph extends Graph<CompleteSession[]> {

    public async draw(data: CompleteSession[]) {
        const yUnit = TimeUnit.Seconds;

        const start = data[0].getStartTime();
        const end = data[data.length - 1].getEndTime();

        const opts = {
            type: 'scatter' as ChartType,
            title: [
                `Länge einer User-Session auf der Seite des Berliner LEAs, bis zur Fehlmeldung 'Es sind keine Termine frei.'`,
                `Start: ${formatDate(start)}`,
                `End: ${formatDate(end)}`,
            ],
            xAxisLabel: `Tageszeit`,
            yAxisLabel: `Dauer (${yUnit})`,
        };

        const datasets = [{
            label: `Länge der User-Session`,
            color: 'red',
            data: data.map((session: CompleteSession) => {
                return {
                    x: session.getStartTime().getTime(),
                    y: session.getDuration().to(yUnit).getAmount(),
                };
            }),
        }];

        await this.generate(datasets, opts);
    }
}

export default NoAppointmentsSessionLengthGraph;