import { Comparable } from '../../types';

abstract class Bucket <Limit extends Comparable, Data extends Comparable> {
    protected start: Limit;
    protected end: Limit;
    protected data: Data[];

    public abstract contains(data: Data): boolean;

    public constructor(start: Limit, end: Limit) {
        this.start = start;
        this.end = end;
        this.data = [];
    }

    public add(data: Data) {
        if (!this.contains(data)) {
            throw new Error('This datapoint does not belong to this bucket.');
        }

        // Sort on insert
        this.data = [...this.data, data].sort((a, b) => a.compare(b));
    }
}

export default Bucket;