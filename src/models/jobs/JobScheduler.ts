import cron from 'node-cron';
import Job from './Job';

class JobScheduler {

    public schedule(job: Job) {
        cron.schedule(job.getExpression(), () => job.execute(), job.getScheduleOptions());
    }
}

export default JobScheduler;