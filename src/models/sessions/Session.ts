import { Log } from '../../types';

export interface SessionArgs {
    id: string,
    startTime?: Date,
    endTime?: Date,
    logs?: Log[],
}

abstract class Session {
    protected id: string;

    protected startTime?: Date;
    protected endTime?: Date;
    
    protected logs: Log[];

    public constructor ({ id, startTime, endTime, logs }: SessionArgs) {
        this.id = id;
        this.startTime = startTime;
        this.endTime = endTime;
        this.logs = logs ?? [];
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
}

export default Session;