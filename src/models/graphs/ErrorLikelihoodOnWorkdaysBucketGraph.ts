import { ChartType } from 'chart.js';
import Graph, { GraphBaseOptions, GraphDatasetOptions } from './Graph';
import { ErrorCounts, TimeUnit } from '../../types';
import { ERROR_COLORS } from '../../config';
import SessionHistory from '../sessions/SessionHistory';
import { isErrorKnown } from '../../utils/errors';
import { fromCountsToArray, generateEmptyCounts, toCountsFromArray, unique } from '../../utils/array';
import logger from '../../logger';
import { assert } from 'console';

class ErrorLikelihoodOnWorkdaysBucketGraph extends Graph<SessionHistory> {
    protected name: string = 'ErrorLikelihoodOnWorkdaysByBucket';
    protected xAxisUnit = TimeUnit.Hours;
    protected yAxisUnit = '%';

    protected generateDatasets(history: SessionHistory) {
        const mergedBuckets = history.getMergedBucketsOnWorkdayBasis();
        const mergedBucketsErrorCounts = mergedBuckets.map(bucket => bucket.getErrorCounts(isErrorKnown));
                
        // Gather all unique errors on workdays
        const errors = mergedBucketsErrorCounts.reduce((prevErrors: string[], errorCounts: ErrorCounts) => {
            return [...prevErrors, ...fromCountsToArray(errorCounts)];
        }, []);
        const uniqueErrors = unique(errors);

        // Total error counts on workdays
        const totalErrorCountsOnWorkdays = toCountsFromArray(errors);

        // Compute likelihood of error per bucket based on corresponding total count over workdays
        return uniqueErrors.map((error) => {
            const data = mergedBuckets
                .map((bucket, i) => {
                    const bucketErrorCounts: ErrorCounts = {
                        ...generateEmptyCounts(uniqueErrors),
                        ...mergedBucketsErrorCounts[i],
                    };

                    return {
                        x: bucket.getStartTime().to(this.xAxisUnit).getAmount(),
                        y: bucketErrorCounts[error] / totalErrorCountsOnWorkdays[error] * 100,
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

export default ErrorLikelihoodOnWorkdaysBucketGraph;