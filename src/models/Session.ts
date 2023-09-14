import { Log } from '../types';
import TimeDuration, { TimeUnit } from './TimeDuration';

class Session {
    protected static texts = {
        Start: '[START]',
        End: '[END]',
    };

    protected start?: number;
    protected end?: number;
    
    protected logs: Log[];
    protected errors: string[];

    public constructor (start?: number, end?: number) {
        this.start = start;
        this.end = end;
        this.logs = [];
        this.errors = [];
    }

    public static getStartText() {
        return this.texts.Start;
    }

    public static getEndText() {
        return this.texts.End;
    }

    public getStart() {
        return this.start;
    }

    public setStart(start: number) {
        this.start = start;
    }

    public getEnd() {
        return this.end;
    }

    public setEnd(end: number) {
        this.end = end;
    }

    public isComplete() {
        return this.start && this.end;
    }

    public getDuration() {
        if (!this.start) throw new Error('Missing session start.');
        if (!this.end) throw new Error('Missing session end.');

        return new TimeDuration(this.end - this.start, TimeUnit.Milliseconds);
    }

    public getLogs() {
        return this.logs;
    }

    public getErrors() {
        return this.errors;
    }
}

export default Session;