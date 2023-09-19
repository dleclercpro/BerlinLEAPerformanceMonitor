import { Log } from '../../types';
import TimeDuration, { TimeUnit } from '../TimeDuration';
import os from 'os';
import process from 'process';
import crypto from 'crypto';
import { EXPECTED_ERRORS } from '../../config';
import { FIVE_MINUTES, LogMessages } from '../../constants';
import { BackToFindAppointmentPageError, NoAppointmentsError } from '../../errors';

interface Options {
    id: string,
    startTime?: Date,
    endTime?: Date,
}

class Session {
    protected id: string;

    protected startTime?: Date;
    protected endTime?: Date;
    
    protected logs: Log[];
    protected errors: string[];

    protected constructor ({ id, startTime, endTime }: Options) {
        this.id = id;
        this.startTime = startTime;
        this.endTime = endTime;
        this.logs = [];
        this.errors = [];
    }

    public static create(startTime?: Date, endTime?: Date) {
        const host = os.hostname();
        const processId = process.pid;
        
        const id = `${host}|${processId}|${crypto.randomUUID()}`;

        return new Session({ id, startTime, endTime });
    }

    public getId() {
        return this.id;
    }

    public getStartTime() {
        return this.startTime;
    }
    
    public getEndTime() {
        return this.endTime;
    }

    public start(start: Date) {
        this.startTime = start;
    }

    public end(end: Date) {
        this.endTime = end;
    }

    // Session is ready to be started
    public isReady() {
        return !this.startTime && !this.endTime;
    }

    // Session started, but didn't finish yet
    public isOpen() {
        return this.startTime && !this.endTime;
    }

    // Session was started and finished
    public isClosed() {
        return this.startTime && this.endTime;
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
}

export default Session;