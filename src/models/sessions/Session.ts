import { Event, EventType, Log } from '../../types';

export interface SessionArgs {
    id: string,
    startTime?: Date,
    endTime?: Date,
    logs?: Log[],
    events?: Event[],
}

abstract class Session {
    protected id: string;

    protected startTime?: Date;
    protected endTime?: Date;
    
    protected logs: Log[];
    protected events: Event[];

    public constructor ({ id, startTime, endTime, logs, events }: SessionArgs) {
        this.id = id;
        this.startTime = startTime;
        this.endTime = endTime;
        this.logs = logs ?? [];
        this.events = events ?? [];
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

    public getEvents() {
        return this.events;
    }

    public getErrors() {
        return this.getEvents()
            .filter(event => event.type === EventType.Bug);
    }
}

export default Session;