import cron, { ScheduleOptions, validate } from 'node-cron';
import Job from './Job';
import logger from '../../logger';
import { JobSchedulerError } from '../../errors';

class JobScheduler {

    public schedule(job: Job, expression: string, options?: ScheduleOptions) {
        if (!expression) throw new Error('Missing cron expression.');
        if (!validate(expression)) throw new Error('Invalid cron expression.');
        
        logger.debug(`Scheduling job '${job.getName()}'...`);

        cron.schedule(
            expression,
            async () => {
                logger.debug(`Executing job '${job.getName()}'...`);

                return job.execute()
                    .then(() => {
                        logger.debug(`Executed job '${job.getName()}'.`);
                    })
                    .catch(() => {
                        logger.fatal(`There was an error while executing job '${job.getName()}'!`);

                        throw new JobSchedulerError();
                    });
            },
            options,
        );

        logger.debug(`Scheduled job '${job.getName()}'.`);
    }
}

export default JobScheduler;