import Job from './Job';

class GenerateGraphsJob extends Job {
    protected name: string = 'GenerateGraphs';
    public static instance?: GenerateGraphsJob;

    public static getInstance() {
        if (!this.instance) {
            this.instance = new GenerateGraphsJob();
        }
        return this.instance;
    }

    public async execute() {
        await this.executeShell(`npm run analyze`);
    }
}

export default GenerateGraphsJob.getInstance();