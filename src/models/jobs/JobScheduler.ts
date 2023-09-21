import cron, { ScheduleOptions, validate } from 'node-cron';
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

    private constructor() {

    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new JobScheduler();
        }
        return this.instance;
    }

    public schedule ({ job, expression, options }: ScheduleArgs) {
        if (!expression) throw new Error('Missing cron expression.');
        if (!validate(expression)) throw new Error('Invalid cron expression.');
        
        logger.debug(`Scheduling job '${job.getName()}'...`);

        cron.schedule(
            expression,
            () => {
                logger.debug(`Executing job '${job.getName()}'...`);

                return job.execute()
                    .then(() => {
                        logger.debug(`Executed job '${job.getName()}'.`);
                    })
                    .catch((err) => {
                        logger.fatal(`There was an error while executing job '${job.getName()}'!`);
                        logger.fatal({ err: err.name, msg: err.message }, LogMessage.UnknownError);
                    });
            },
            options,
        );

        logger.debug(`Scheduled job '${job.getName()}'.`);
    }
}

export default JobScheduler.getInstance();