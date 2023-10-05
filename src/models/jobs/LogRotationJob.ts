import Job from './Job';
import LogRotater from '../logs/LogRotater';

class LogRotationJob extends Job {

    public async execute() {
        await LogRotater.rotate();
    }
}

export default LogRotationJob;