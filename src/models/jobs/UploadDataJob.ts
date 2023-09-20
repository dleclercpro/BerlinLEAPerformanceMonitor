import { GITHUB_TOKEN, GITHUB_USER, GITHUB_REPO_OWNER, GITHUB_REPO, GIT_REMOTE, GIT_AUTHOR_NAME, GIT_AUTHOR_EMAIL } from '../../config';
import logger from '../../logger';
import Job from './Job';

class UploadDataJob extends Job {
    protected name: string = 'UploadData';
    protected remoteUrl: string = `https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO}.git`;
    public static instance?: UploadDataJob;

    public static getInstance() {
        if (!this.instance) {
            this.instance = new UploadDataJob();
        }
        return this.instance;
    }

    public async execute() {
        if (await this.hasInvalidRemoteUrl()) {
            await this.setRemoteUrl(this.remoteUrl);
        }

        if (!await this.hasRemote()) {
            await this.addRemote();
        }

        await this.pull();

        if (await this.commit()) {
            await this.push();            
        }
    }

    protected async hasRemote() {
        return await this.getRemoteUrl() !== '';
    }

    protected async hasInvalidRemoteUrl() {
        return await this.getRemoteUrl() !== this.remoteUrl;
    }

    protected async getRemoteUrl() {
        logger.debug(`Getting Git remote (${GIT_REMOTE}) URL...`);
    
        return this.executeShell(`git remote get-url ${GIT_REMOTE}`)
            .then((url) => url)
            .catch(() => '');
    }

    protected async setRemoteUrl(url: string) {
        logger.debug(`Setting Git remote (${GIT_REMOTE}) URL: ${url}`);

        await this.executeShell(`git remote set-url ${GIT_REMOTE} ${url}`);
    }

    protected async addRemote() {
        logger.debug(`Adding Git remote: ${GIT_REMOTE}`);

        await this.executeShell(`git remote add -t master -m master -f ${GIT_REMOTE} ${this.remoteUrl}`);
    }

    protected async commit(message = `New data.`) {
        logger.debug(`Adding data to commit...`);
        await this.executeShell(`git add data`);

        logger.debug(`Committing...`)
        return this.executeShell(
            // `GIT_COMMITTER_NAME="${GIT_AUTHOR_NAME}" ` +
            // `GIT_COMMITTER_EMAIL="${GIT_AUTHOR_EMAIL}" ` +
            `git commit --author "${GIT_AUTHOR_NAME} <${GIT_AUTHOR_EMAIL}>" -m "${message}"`
        )
        .then(() => {
            logger.debug(`There were new changes to commit.`);
            return true;
        })
        .catch((err) => {
            logger.debug(`There were no changes to commit.`);
            logger.error(err);
            return false;
        });
    }

    protected async pull() {
        logger.debug(`Pulling...`);
        await this.executeShell(`git pull`);
    }

    protected async push() {
        logger.debug(`Pushing...`);
        await this.executeShell(`git push --repo ${GIT_REMOTE}`);
    }
}

export default UploadDataJob.getInstance();