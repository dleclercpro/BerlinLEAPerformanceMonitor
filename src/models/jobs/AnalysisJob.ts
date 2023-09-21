import { analyzeLogs } from '../../analysis';
import { LOGS_FILEPATH } from '../../config/file';
import Job from './Job';

class AnalysisJob extends Job {

    public async execute() {
        await analyzeLogs(LOGS_FILEPATH);
    }
}

export default AnalysisJob;