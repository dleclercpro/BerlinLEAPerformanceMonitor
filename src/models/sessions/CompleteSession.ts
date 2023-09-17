import { Log } from '../../types';
import Session from './Session';

interface Options {
    id: string,
    startTime: Date,
    endTime: Date,
    logs: Log[],
    errors: string[],
}

// FIXME
class CompleteSession extends Session {
    protected startTime: Date;
    protected endTime: Date;
    protected logs: Log[];
    protected errors: string[];

    public constructor (args: Options) {
        const { startTime, endTime, logs, errors } = args;

        super(args);

        this.startTime = startTime;
        this.endTime = endTime;
        this.logs = logs;
        this.errors = errors;
    }

    public getStartTime() {
        return this.startTime;
    }
    
    public getEndTime() {
        return this.endTime;
    }

    public static create(startTime: Date, endTime: Date) {
        return Session.create(startTime, endTime);
    }
}

export default CompleteSession;