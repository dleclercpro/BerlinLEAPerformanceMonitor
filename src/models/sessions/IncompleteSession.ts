import { Log } from '../../types';
import os from 'os';
import process from 'process';
import crypto from 'crypto';
import Session from './Session';

class IncompleteSession extends Session {

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
}

export default IncompleteSession;