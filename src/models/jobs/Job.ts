import { ScheduleOptions, validate } from 'node-cron';

abstract class Job {
    protected expression: string;
    protected scheduleOptions?: ScheduleOptions;

    public abstract execute(): void;

    public constructor(expression?: string, scheduleOptions?: ScheduleOptions) {
        if (!expression) throw new Error('Missing cron expression.');
        if (!validate(expression)) throw new Error('Invalid cron expression.');
        
        this.expression = expression;
        this.scheduleOptions = scheduleOptions;
    }

    public getExpression() {
        return this.expression;
    }

    public getScheduleOptions() {
        return this.scheduleOptions;
    }
}

export default Job;