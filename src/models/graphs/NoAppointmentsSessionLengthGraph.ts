import { ChartType } from 'chart.js';
import Graph from './Graph';
import { TimeUnit } from '../TimeDuration';
import { formatDate } from '../../utils/time';
import Session from '../sessions/Session';

class NoAppointmentsSessionLengthGraph extends Graph<Session[]> {

    public async draw(data: Session[]) {
        const yUnit = TimeUnit.Seconds;

        const start = data[0].getStart()!;
        const end = data[data.length - 1].getEnd()!;

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
            data: data.map((session: Session) => {
                return {
                    x: session.getStart()!.getTime(),
                    y: session.getDuration()!.to(yUnit).getAmount(),
                };
            }),
        }];

        await this.generate(datasets, opts);
    }
}

export default NoAppointmentsSessionLengthGraph;