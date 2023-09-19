import { ChartType } from 'chart.js';
import Graph, { GraphBaseOptions, GraphDatasetOptions } from './Graph';
import { ErrorDict, TimeUnit } from '../../types';
import { ERROR_COLORS } from '../../config';
import { sum } from '../../utils/math';

class WorkdaysErrorGraphByBucket extends Graph<ErrorDict[]> {
    protected xAxisUnit = TimeUnit.Hours;
    protected yAxisUnit = '%';

    protected generateDatasets(errorDicts: ErrorDict[]) {
        const errors = Object.keys(errorDicts[0]);

        return errors.map((error) => {
            const data = errorDicts.map((errorDict, i) => {
                return {
                    x: i,
                    y: errorDict[error] / sum(Object.values(errorDict)) * 100,
                };
            });
    
            // Daily graph: first and last point (midnight) should be equal
            if (data.length > 0) {
                data.push({ x: 24, y: data[0].y });
            }

            return data;
        });
    }

    protected generateDatasetOptions(errorDicts: ErrorDict[]) {
        const errors = Object.keys(errorDicts[0]);

        return errors.map((error, i) => {
            return {
                label: error,
                color: ERROR_COLORS[i],
            };
        });
    }

    protected generateBaseOptions(title: string[]): GraphBaseOptions {
        return {
            type: 'line' as ChartType,
            title,
            axes:{
                x: {
                    label: `Tageszeit (${this.xAxisUnit})`,
                    min: 0,
                    max: 24,
                },
                y: {
                    label: `Anteil (${this.yAxisUnit})`,
                },
            },
        };
    }

    protected fillDatasetOptions(args: GraphDatasetOptions) {
        return {
            ...super.fillDatasetOptions(args),
            borderWidth: 2,
            pointRadius: 2,
        };
    }
}

export default WorkdaysErrorGraphByBucket;