import { Log } from '../../types';

interface Options {
    id: string,
    startTime?: Date,
    endTime?: Date,
    logs?: Log[],
    errors?: string[],
}

abstract class Session {
    protected id: string;

    protected startTime?: Date;
    protected endTime?: Date;
    
    protected logs: Log[];
    protected errors: string[];

    public constructor ({ id, startTime, endTime, logs, errors }: Options) {
        this.id = id;
        this.startTime = startTime;
        this.endTime = endTime;
        this.logs = logs ?? [];
        this.errors = errors ?? [];
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