import Job from './Job';
import LogRotater from '../LogRotater';

class LogRotationJob extends Job {

    public async execute() {
        await LogRotater.rotate();
    }
}

export default LogRotationJob;