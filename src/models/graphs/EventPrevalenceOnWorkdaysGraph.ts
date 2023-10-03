import { ChartType, Color as ChartColor } from 'chart.js';
import Graph from './Graph';
import { CountsDict, GraphAxes, TimeUnit } from '../../types';
import { equals, getRange, sum } from '../../utils/math';
import SessionHistory from '../sessions/SessionHistory';
import { isKnownEvent } from '../../utils/event';
import { generateEmptyCounts } from '../../utils/array';
import { formatDate } from '../../utils/locale';
import { LONG_DATE_TIME_FORMAT_OPTIONS } from '../../config/locale';
import assert from 'assert';
import { getEventColor } from '../../utils/styles';

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
            `Zweistündliche Prävalenz aller während User-Sessions erlebten Ereignisse an Werktagen auf der LEA-Seite`,
            `Start: ${formatDate(start, LONG_DATE_TIME_FORMAT_OPTIONS)} | Ende: ${formatDate(end, LONG_DATE_TIME_FORMAT_OPTIONS)}`,
            `Bucket-Größe: ${history.getBucketSize().format()} | Anzahl der Ereignissen: ${totalErrorCount}`,
        ];

        await super.draw(history);
    }

    protected generateDatasets(history: SessionHistory) {

        // Generate set of errors that will be considered
        const uniqueErrors = history.getUniqueErrors(isKnownEvent);

        const mergedBuckets = history.getMergedWorkdayBuckets();
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
                color: getEventColor(error),
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