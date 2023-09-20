import GenerateGraphsJob from './GenerateGraphsJob';
import Job from './Job';
import UploadDataJob from './UploadDataJob';

interface Args {
    upload: boolean,
}

class GenerateGraphsAndUploadDataJob extends Job {
    protected name: string = 'GenerateGraphsAndUploadData';
    protected upload: boolean;

    public constructor({ upload }: Args) {
        super();

        this.upload = upload;
    }

    public async execute() {
        await new GenerateGraphsJob().execute();

        if (this.upload) {
            await new UploadDataJob().execute();
        }
    }
}

export default GenerateGraphsAndUploadDataJob;