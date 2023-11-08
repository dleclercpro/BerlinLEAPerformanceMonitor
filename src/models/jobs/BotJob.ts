import AnalysisJob from './AnalysisJob';
import Job from './Job';
import GitJob from './GitJob';
import { GIT_BOT_REMOTE, GITHUB_BOT_TOKEN, GITHUB_BOT_USER, GITHUB_REPO, GITHUB_REPO_OWNER, GIT_BOT_EMAIL, GIT_BOT_NAME } from '../../config/git';
import { GitAuthor, GitRemote } from '../../types';
import Release from '../Release';
import { RELEASE_MIN } from '../../config';

interface Args {
    upload: boolean,
    analyze: boolean,
    since: Date | Release,
}

class BotJob extends Job {
    protected upload: boolean;
    protected analyze: boolean;
    protected since?: Date | Release;

    public constructor(args: Args = { upload: true, analyze: true, since: RELEASE_MIN }) {
        super();

        const { upload, analyze, since } = args;

        this.upload = upload;
        this.analyze = analyze;
        this.since = since;
    }

    public async execute() {
        if (this.analyze) {
            await new AnalysisJob({ since: this.since }).execute();
        }

        if (this.upload) {
            const url = `https://${GITHUB_BOT_USER}:${GITHUB_BOT_TOKEN}@github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO}.git`;

            const remote: GitRemote = { name: GIT_BOT_REMOTE!, url };
            const author: GitAuthor = { name: GIT_BOT_NAME!, email: GIT_BOT_EMAIL! };

            await new GitJob(remote, author).execute();
        }
    }
}

export default BotJob;