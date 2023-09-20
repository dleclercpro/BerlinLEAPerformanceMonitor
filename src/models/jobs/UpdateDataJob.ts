import { GITHUB_TOKEN, GITHUB_USER, GITHUB_REPO } from '../../config';
import Job from './Job';

interface Args {
    author: {
        name: string,
        email: string,
    },
}

class UpdateDataJob extends Job<Args> {
    protected name: string = 'GenerateGraphs';
    public static instance?: UpdateDataJob;

    public static getInstance() {
        if (!this.instance) {
            this.instance = new UpdateDataJob();
        }
        return this.instance;
    }

    public async execute({ author }: Args) {
        const remoteName = `bot-origin`;
        const remoteUrl = `https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${GITHUB_REPO}.git`;

        await this.executeShell(`git remote add -f -m ${remoteName} ${remoteUrl}`)
        await this.executeShell(`git commit --author="[Bot] ${author.name} <${author.email}>" -m "New data." `);
        await this.executeShell(`git push --repo ${remoteName}`);
    }
}

export default UpdateDataJob.getInstance();