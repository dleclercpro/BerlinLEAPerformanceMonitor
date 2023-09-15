import { Log } from '../../types';
import TimeDuration, { TimeUnit } from '../TimeDuration';
import os from 'os';
import process from 'process';
import crypto from 'crypto';
import { EXPECTED_ERRORS } from '../../errors';

interface SessionOptions {
    id: string,
    start?: Date,
    end?: Date,
}

class Session {
    protected id: string;

    protected start?: Date;
    protected end?: Date;
    
    protected logs: Log[];
    protected errors: string[];

    public constructor ({ id, start, end }: SessionOptions) {
        this.id = id;
        this.start = start;
        this.end = end;
        this.logs = [];
        this.errors = [];
    }

    public static create() {
        const host = os.hostname();
        const processId = process.pid;
        
        const id = `${host}|${processId}|${crypto.randomUUID()}`;

        return new Session({ id });
    }

    public getId() {
        return this.id;
    }

    public getStart() {
        return this.start;
    }

    public setStart(start: Date) {
        this.start = start;
    }

    public getEnd() {
        return this.end;
    }

    public setEnd(end: Date) {
        this.end = end;
    }

    public isNew() {
        return !this.start && !this.end;
    }

    public isOpen() {
        return this.start && !this.end;
    }

    public isClosed() {
        return this.start && this.end;
    }

    public pushLog(log: Log) {
        this.logs.push(log);
    }

    public getLogs() {
        return this.logs;
    }

    public getErrors() {
        return this.logs
            .map(log => log.err)
            .filter(Boolean) as string[];
    }

    public hasUnexpectedErrors() {
        return this.getUnexpectedErrors().length > 0;
    }

    public getUnexpectedErrors() {
        return this.getErrors()
            .filter(err => !EXPECTED_ERRORS.map(e => e.name).includes(err));
    }

    public getDuration() {
        if (!this.start) throw new Error('Missing session start.');
        if (!this.end) throw new Error('Missing session end.');

        const startTime = this.start.getTime();
        const endTime = this.end.getTime();

        return new TimeDuration(endTime - startTime, TimeUnit.Milliseconds);
    }
}

export default Session;