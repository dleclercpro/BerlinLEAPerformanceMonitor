import { ChartType } from 'chart.js';
import Graph, { GraphBaseOptions, GraphDatasetOptions } from './Graph';
import { TimeUnit } from '../../types';
import { ERROR_COLORS } from '../../config';
import { sum } from '../../utils/math';
import SessionHistory from '../sessions/SessionHistory';
import { isErrorKnown } from '../../utils/errors';

class WorkdayErrorsGraphByBucket extends Graph<SessionHistory> {
    protected xAxisUnit = TimeUnit.Hours;
    protected yAxisUnit = '%';

    protected generateDatasets(history: SessionHistory) {
        const mergedBuckets = history.getMergedBucketsOnWorkdayBasis();

        const errorDicts = mergedBuckets.map(bucket => bucket.getErrorDict(isErrorKnown));
        const errors = history.getUniqueErrors().filter(isErrorKnown);

        return errors.map((error) => {
            const data = mergedBuckets
                .map((bucket, i) => {
                    return {
                        x: bucket.getStartTime().to(this.xAxisUnit).getAmount(),
                        y: errorDicts[i][error] / sum(Object.values(errorDicts[i])) * 100,
                    };
                });
    
            // Daily graph: first and last point (midnight) should be equal
            if (data.length > 0) {
                data.push({ x: 24, y: data[0].y });
            }

            return data;
        });
    }

    protected generateDatasetOptions(history: SessionHistory) {
        return history.getUniqueErrors()
            .filter(isErrorKnown)
            .map((error, i) => {
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

export default WorkdayErrorsGraphByBucket;