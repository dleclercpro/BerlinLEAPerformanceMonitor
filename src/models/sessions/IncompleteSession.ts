import os from 'os';
import process from 'process';
import crypto from 'crypto';
import Session from './Session';
import Log from '../../Log';

class IncompleteSession extends Session {
    protected errors: string[] = [];

    public static create(startTime?: Date, endTime?: Date) {
        const host = os.hostname();
        const processId = process.pid;
        
        const id = `${host}|${processId}|${crypto.randomUUID()}`;

        return new IncompleteSession({ id, startTime, endTime });
    }

    public start(start: Date) {
        this.startTime = start;
    }

    public end(end: Date) {
        this.endTime = end;
    }

    // Session started, but didn't finish yet
    public isOpen() {
        return this.startTime && !this.endTime;
    }

    // Session was started and finished
    public isComplete() {
        return this.startTime && this.endTime;
    }

    public hasErrors() {
        return this.errors.length > 0;
    }

    public getErrors() {
        return this.errors;
    }

    public push(log: Log) {
        this.logs.push(log);

        if (log.hasError()) {
            this.errors.push(log.getError()!);
        }
    }
}

export default IncompleteSession;