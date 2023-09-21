import { analyzeLogs } from '../../analysis';
import { LOGS_FILEPATH } from '../../config/file';
import Job from './Job';

class AnalysisJob extends Job {
    protected name: string = 'AnalysisJob';

    public constructor() {
        super();
    }

    public async execute() {
        await analyzeLogs(LOGS_FILEPATH);
    }
}

export default AnalysisJob;