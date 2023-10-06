import { schedule, ScheduledTask, ScheduleOptions, validate } from 'node-cron';
import Job from './Job';
import logger from '../../logger';
import { LogMessage } from '../../constants';

interface ScheduleArgs {
    job: Job,
    expression: string,
    options?: ScheduleOptions,
}

class JobScheduler {
    private static instance?: JobScheduler;

    protected tasks: ScheduledTask[];

    private constructor() {
        this.tasks = [];
    }

    public static getInstance() {
        if (!JobScheduler.instance) {
            JobScheduler.instance = new JobScheduler();
        }
        return JobScheduler.instance;
    }

    public schedule({ job, expression, options }: ScheduleArgs) {
        if (!expression) throw new Error('Missing cron expression.');
        if (!validate(expression)) throw new Error('Invalid cron expression.');
        
        logger.debug(`Scheduling job '${job.getName()}'...`);

        const task = schedule(
            expression,
            () => {
                logger.debug(`Executing job '${job.getName()}'...`);

                return job.execute()
                    .then(() => {
                        logger.debug(`Executed job '${job.getName()}'.`);
                    })
                    .catch((err) => {
                        logger.fatal(`There was an error while executing job '${job.getName()}'!`);

                        // TO TEST
                        logger.fatal({ err: err.name, msg: err.message }, LogMessage.UnknownEvent);
                    });
            },
            options,
        );

        logger.debug(`Scheduled job '${job.getName()}'.`);

        this.tasks.push(task);
    }

    public hasScheduledJobs() {
        return this.tasks.length > 0;
    }

    public stopAll() {
        logger.debug(`Stopping all jobs...`);

        this.tasks.forEach((task: ScheduledTask) => {
            task.stop();
        });

        this.tasks = [];

        logger.debug(`Stopped all jobs.`);
    }
}

export default JobScheduler.getInstance();