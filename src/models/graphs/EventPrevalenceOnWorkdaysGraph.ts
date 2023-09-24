import { ChartType, Color as ChartColor } from 'chart.js';
import Graph from './Graph';
import { CountsDict, GraphAxes, TimeUnit } from '../../types';
import { equals, getRange, sum } from '../../utils/math';
import SessionHistory from '../sessions/SessionHistory';
import { isKnownEvent } from '../../utils/event';
import { fromCountsToArray, generateEmptyCounts, unique } from '../../utils/array';
import { formatDate } from '../../utils/locale';
import { LONG_DATE_TIME_FORMAT_OPTIONS } from '../../config/locale';
import assert from 'assert';
import { getErrorColor } from '../../utils/styles';
import logger from '../../logger';

class EventPrevalenceOnWorkdaysGraph extends Graph<SessionHistory> {
    protected type: ChartType = 'bar';
    protected axes: GraphAxes = {
        x: { label: `Tageszeit`, unit: TimeUnit.Hours, min: 0, max: 24 },
        y: { label: `Anteil`, unit: `%` },
    };

    public async draw(history: SessionHistory) {
        const start = history.getEarliestSession()!.getStartTime();
        const end = history.getLatestSession()!.getEndTime();

        const totalErrorCount = history.getErrors(isKnownEvent).length;

        this.title = [
            `Prävalenz aller Ereignisse während einer User-Session an Werktagen auf der LEA-Seite`,
            `Start: ${formatDate(start, LONG_DATE_TIME_FORMAT_OPTIONS)} | Ende: ${formatDate(end, LONG_DATE_TIME_FORMAT_OPTIONS)}`,
            `Bucket-Größe: ${history.getBucketSize().format()} | Anzahl der Ereignissen: ${totalErrorCount}`,
        ];

        await super.draw(history);
    }

    protected generateDatasets(history: SessionHistory) {
        const uniqueErrors = history.getUniqueErrors();

        const mergedBuckets = history.getMergedBucketsOnWorkdayBasis();
        const mergedBucketsErrorCounts: CountsDict[] = mergedBuckets.map(bucket => {
            return {
                ...generateEmptyCounts(uniqueErrors),
                ...bucket.getErrorCounts(isKnownEvent),
            };
        });

        // Compute prevalence of each error (in percentage) for each bucket
        const prevalences = uniqueErrors.map((error) => {
            const data = mergedBuckets
                .map((bucket, bucketIndex) => {
                    const errorOccurencesInBucket = mergedBucketsErrorCounts[bucketIndex][error];
                    const totalOccurencesInBucket = sum(Object.values(mergedBucketsErrorCounts[bucketIndex]));

                    return {
                        x: bucket.getStartTime().to(this.axes.x.unit as TimeUnit).getAmount(),
                        y: errorOccurencesInBucket / totalOccurencesInBucket * 100,
                    };
                });
    
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

        // Sum of error prevalences inside any given bucket should be 100%
        getRange(mergedBuckets.length).forEach((bucketIndex: number) => {
            const sumOfPrevalencesInBucket = uniqueErrors.reduce((prevTotal, error, errorIndex) => {
                return prevTotal + prevalences[errorIndex].data[bucketIndex].y;
            }, 0);

            assert(equals(sumOfPrevalencesInBucket, 100) === true);
        });

        return prevalences;
    }

    protected generateDatasetOptions(label: string, color: ChartColor) {
        return {
            ...super.generateDatasetOptions(label, color),
            borderWidth: 2,
            pointRadius: 2,
        };
    }
}

export default EventPrevalenceOnWorkdaysGraph;