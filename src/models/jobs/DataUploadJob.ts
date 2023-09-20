import PlottingJob from './PlottingJob';
import Job from './Job';
import GitJob from './GitJob';
import { GIT_REMOTE, GIT_AUTHOR } from '../../config/GitConfig';

interface Args {
    upload: boolean,
}

class DataUploadJob extends Job {
    protected name: string = 'GenerateGraphsAndUploadData';
    protected upload: boolean;

    public constructor({ upload }: Args) {
        super();

        this.upload = upload;
    }

    public async execute() {
        await new PlottingJob().execute();

        if (this.upload) {
            await new GitJob(GIT_REMOTE, GIT_AUTHOR).execute();
        }
    }
}

export default DataUploadJob;