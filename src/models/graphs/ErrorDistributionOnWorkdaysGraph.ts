import { ChartType, Color as ChartColor } from 'chart.js';
import Graph from './Graph';
import { CountsDict, GraphAxes, TimeUnit } from '../../types';
import SessionHistory from '../sessions/SessionHistory';
import { isKnownBug } from '../../utils/event';
import { generateEmptyCounts } from '../../utils/array';
import { LONG_DATE_TIME_FORMAT_OPTIONS } from '../../config/locale';
import { formatDate } from '../../utils/locale';
import assert from 'assert';
import { equals, sum } from '../../utils/math';
import { getEventColor } from '../../utils/styles';

class ErrorDistributionOnWorkdaysGraph extends Graph<SessionHistory> {
    protected type: ChartType = 'line';
    protected axes: GraphAxes = {
        x: { label: `Tageszeit`, unit: TimeUnit.Hours, min: 0, max: 24 },
        y: { label: `Anteil`, unit: `%` },
    };

    public async draw(history: SessionHistory) {
        const start = history.getEarliestSession()!.getStartTime();
        const end = history.getLatestSession()!.getEndTime();

        this.title = [
            `Verteilung nach Tageszeit aller während User-Sessions erlebten Bugs an Werktagen auf der LEA-Seite`,
            `Start: ${formatDate(start, LONG_DATE_TIME_FORMAT_OPTIONS)} | Ende: ${formatDate(end, LONG_DATE_TIME_FORMAT_OPTIONS)}`,
            `Bucket-Größe: ${history.getBucketSize().format()}`,
        ];

        await super.draw(history);
    }

    protected generateDatasets(history: SessionHistory) {

        // Generate set of errors that will be considered
        const uniqueErrors = history.getUniqueErrors(isKnownBug);

        const mergedBuckets = history.getMergedWorkdayBuckets();
        const mergedBucketsErrorCounts: CountsDict[] = mergedBuckets.map(bucket => {
            return {
                ...generateEmptyCounts(uniqueErrors),
                ...bucket.getErrorCounts(isKnownBug),
            };
        });

        // Compute likelihood of error per bucket based on corresponding total count over workdays
        return uniqueErrors.map((error) => {
            const totalErrorOccurencesOnWorkdays = mergedBucketsErrorCounts.reduce((prevErrorOccurences, mergedBucket) => {
                return prevErrorOccurences + mergedBucket[error];
            }, 0);

            const data = mergedBuckets
                .map((bucket, bucketIndex) => {
                    const bucketErrorCounts: CountsDict = {
                        ...generateEmptyCounts(uniqueErrors),
                        ...mergedBucketsErrorCounts[bucketIndex],
                    };
                    const errorOccurencesInBucket = bucketErrorCounts[error];

                    return {
                        x: bucket.getStartTime().to(this.axes.x.unit as TimeUnit).getAmount(),
                        y: errorOccurencesInBucket / totalErrorOccurencesOnWorkdays * 100,
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
                color: getEventColor(error),
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

export default ErrorDistributionOnWorkdaysGraph;