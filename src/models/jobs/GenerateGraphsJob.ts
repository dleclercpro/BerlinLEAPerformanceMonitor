import Job from './Job';

class GenerateGraphsJob extends Job {
    protected name: string = 'GenerateGraphs';

    public constructor() {
        super();
    }

    public async execute() {
        await this.executeShell(`npm run analyze`);
    }
}

export default GenerateGraphsJob;