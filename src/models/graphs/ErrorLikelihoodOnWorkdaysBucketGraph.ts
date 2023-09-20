import { ChartType, Color as ChartColor } from 'chart.js';
import Graph from './Graph';
import { ErrorCounts, GraphAxes, TimeUnit } from '../../types';
import { ERROR_COLORS } from '../../config/styles';
import SessionHistory from '../sessions/SessionHistory';
import { isErrorKnown } from '../../utils/errors';
import { fromCountsToArray, generateEmptyCounts, toCountsFromArray, unique } from '../../utils/array';
import { LONG_DATE_TIME_FORMAT_OPTIONS } from '../../config/locale';
import { formatDate } from '../../utils/locale';

class ErrorLikelihoodOnWorkdaysBucketGraph extends Graph<SessionHistory> {
    protected name: string = 'ErrorLikelihoodOnWorkdaysByBucket';
    protected type: ChartType = 'line';
    protected axes: GraphAxes = {
        x: { label: `Tageszeit`, unit: TimeUnit.Hours, min: 0, max: 24 },
        y: { label: `Wahrscheinlichkeit`, unit: `%` },
    };

    public async draw(history: SessionHistory) {
        const start = history.getEarliestSession()!.getStartTime();
        const end = history.getLatestSession()!.getEndTime();

        this.title = [
            `Auftrittswahrscheinlichkeit aller während einer User-Session erlebten Bugs zwischen Montag und Freitag auf der Seite des Berliner LEAs`,
            `Bucket-Größe: ${history.getBucketSize().format()}`,
            `Start: ${formatDate(start, LONG_DATE_TIME_FORMAT_OPTIONS)}`,
            `Ende: ${formatDate(end, LONG_DATE_TIME_FORMAT_OPTIONS)}`,
        ];

        await super.draw(history);
    }

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
        return uniqueErrors.map((error, i) => {
            const data = mergedBuckets
                .map((bucket, j) => {
                    const bucketErrorCounts: ErrorCounts = {
                        ...generateEmptyCounts(uniqueErrors),
                        ...mergedBucketsErrorCounts[j],
                    };

                    return {
                        x: bucket.getStartTime().to(this.axes.x.unit as TimeUnit).getAmount(),
                        y: bucketErrorCounts[error] / totalErrorCountsOnWorkdays[error] * 100,
                    };
                });
    
            // Daily graph: first and last point (midnight) should be equal
            if (data.length > 0) {
                data.push({ x: 24, y: data[0].y });
            }

            return {
                data,
                label: error,
                color: ERROR_COLORS[i],
            };
        });
    }

    protected generateDatasetOptions(label: string, color: ChartColor) {
        return {
            ...super.generateDatasetOptions(label, color),
            borderWidth: 2,
            pointRadius: 2,
        };
    }
}

export default ErrorLikelihoodOnWorkdaysBucketGraph;