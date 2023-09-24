import { ChartType, Color as ChartColor } from 'chart.js';
import Graph from './Graph';
import { ErrorCounts, GraphAxes, TimeUnit } from '../../types';
import SessionHistory from '../sessions/SessionHistory';
import { isKnownBug } from '../../utils/event';
import { fromCountsToArray, generateEmptyCounts, toCountsFromArray, unique } from '../../utils/array';
import { LONG_DATE_TIME_FORMAT_OPTIONS } from '../../config/locale';
import { formatDate } from '../../utils/locale';
import assert from 'assert';
import { equals, sum } from '../../utils/math';
import { getErrorColor } from '../../utils/styles';

class ErrorLikelihoodOnWorkdaysGraph extends Graph<SessionHistory> {
    protected type: ChartType = 'line';
    protected axes: GraphAxes = {
        x: { label: `Tageszeit`, unit: TimeUnit.Hours, min: 0, max: 24 },
        y: { label: `Wahrscheinlichkeit`, unit: `%` },
    };

    public async draw(history: SessionHistory) {
        const start = history.getEarliestSession()!.getStartTime();
        const end = history.getLatestSession()!.getEndTime();

        this.title = [
            `Auftrittswahrscheinlichkeit aller während einer User-Session erlebten Bugs an Werktagen auf der LEA-Seite`,
            `Start: ${formatDate(start, LONG_DATE_TIME_FORMAT_OPTIONS)} | Ende: ${formatDate(end, LONG_DATE_TIME_FORMAT_OPTIONS)}`,
            `Bucket-Größe: ${history.getBucketSize().format()}`,
        ];

        await super.draw(history);
    }

    protected generateDatasets(history: SessionHistory) {
        const mergedBuckets = history.getMergedBucketsOnWorkdayBasis();
        const mergedBucketsErrorCounts = mergedBuckets.map(bucket => bucket.getErrorCounts(isKnownBug));
                
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
                        x: bucket.getStartTime().to(this.axes.x.unit as TimeUnit).getAmount(),
                        y: bucketErrorCounts[error] / totalErrorCountsOnWorkdays[error] * 100,
                    };
                });

            // Sum of probabilities over buckets should be 100% for any given error
            assert(equals(sum(data.map(point => point.y)), 100));
    
            // Daily graph: first and last point (midnight) should be equal
            if (data.length > 0) {
                data.push({ x: 24, y: data[0].y });
            }

            return {
                data,
                label: error,
                color: getErrorColor(error),
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

export default ErrorLikelihoodOnWorkdaysGraph;