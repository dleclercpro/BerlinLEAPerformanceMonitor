import AnalysisJob from './AnalysisJob';
import Job from './Job';
import GitJob from './GitJob';
import { GIT_BOT_REMOTE, GITHUB_BOT_TOKEN, GITHUB_BOT_USER, GITHUB_REPO, GITHUB_REPO_OWNER, GIT_BOT_EMAIL, GIT_BOT_NAME } from '../../config/git';

interface Args {
    upload: boolean,
    analyze: boolean,
}

class BotJob extends Job {
    protected name: string = 'BotJob';
    protected upload: boolean;
    protected analyze: boolean;

    public constructor(args: Args = { upload: true, analyze: true }) {
        super();

        const { upload, analyze } = args;

        this.upload = upload;
        this.analyze = analyze;
    }

    public async execute() {
        if (this.analyze) {
            await new AnalysisJob().execute();
        }

        if (this.upload) {
            await new GitJob({
                name: GIT_BOT_REMOTE!,
                url: `https://${GITHUB_BOT_USER}:${GITHUB_BOT_TOKEN}@github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO}.git`,
            }, {
                name: GIT_BOT_NAME!,
                email: GIT_BOT_EMAIL!,
            })
            .execute();
        }
    }
}

export default BotJob;