import Job from './Job';

class PlottingJob extends Job {
    protected name: string = 'GenerateGraphs';

    public constructor() {
        super();
    }

    public async execute() {
        await this.executeShell(`npm run analyze`);
    }
}

export default PlottingJob;