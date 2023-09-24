import { ChartType, Color as ChartColor } from 'chart.js';
import Graph from './Graph';
import { CountsDict, GraphAxes, TimeUnit } from '../../types';
import { equals, sum } from '../../utils/math';
import SessionHistory from '../sessions/SessionHistory';
import { isKnownEvent } from '../../utils/event';
import { fromCountsToArray, unique } from '../../utils/array';
import { formatDate } from '../../utils/locale';
import { LONG_DATE_TIME_FORMAT_OPTIONS } from '../../config/locale';
import assert from 'assert';
import { getErrorColor } from '../../utils/styles';

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
        const mergedBuckets = history.getMergedBucketsOnWorkdayBasis();
        const mergedBucketsErrorCounts = mergedBuckets.map(bucket => bucket.getErrorCounts(isKnownEvent));
        
        // Gather all unique errors on workdays
        const errors = mergedBucketsErrorCounts.reduce((prevErrors: string[], errorCounts: CountsDict) => {
            return [...prevErrors, ...fromCountsToArray(errorCounts)];
        }, []);
        const uniqueErrors = unique(errors);

        // Compute prevalence of each error (in percentage) for each bucket
        const errorPrevalences = uniqueErrors.map((error) => {
            const data = mergedBuckets
                .map((bucket, j) => {
                    const bucketErrorCount = mergedBucketsErrorCounts[j][error];
                    const totalBucketErrorCount = sum(Object.values(mergedBucketsErrorCounts[j]));

                    return {
                        x: bucket.getStartTime().to(this.axes.x.unit as TimeUnit).getAmount(),
                        y: bucketErrorCount / totalBucketErrorCount * 100,
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

        // TODO: sum of error prevalences inside any given bucket should be 100%

        return errorPrevalences;
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