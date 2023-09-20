import { GITHUB_TOKEN, GITHUB_USER, GITHUB_REPO_OWNER, GITHUB_REPO, GIT_REMOTE, GIT_AUTHOR_NAME, GIT_AUTHOR_EMAIL, DATA_DIR } from '../../config';
import logger from '../../logger';
import Job from './Job';

const REMOTE_URL = `https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO}.git`;

class UploadDataJob extends Job {
    protected name: string = 'UploadData';

    public constructor() {
        super();
    }

    public async execute() {
        if (!await this.isRemoteUrlValid()) {
            await this.setRemoteUrl(REMOTE_URL);
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

    protected async isRemoteUrlValid() {
        return await this.getRemoteUrl() === REMOTE_URL;
    }

    protected async getRemoteUrl() {
        logger.debug(`Getting URL for Git remote: ${GIT_REMOTE}`);
    
        return this.executeShell(`git remote get-url ${GIT_REMOTE}`)
            .then((url) => url)
            .catch(() => '');
    }

    protected async setRemoteUrl(url: string) {
        logger.debug(`Setting URL for Git remote: ${GIT_REMOTE}`);

        await this.executeShell(`git remote set-url ${GIT_REMOTE} ${url}`);
    }

    protected async addRemote() {
        logger.debug(`Adding Git remote: ${GIT_REMOTE}`);

        await this.executeShell(`git remote add -t master -m master -f ${GIT_REMOTE} ${REMOTE_URL}`);
    }

    protected async commit(message = `New data.`) {
        logger.debug(`Adding data to commit.`);
        await this.executeShell(`git add ${DATA_DIR}`);

        const author = `${GIT_AUTHOR_NAME} <${GIT_AUTHOR_EMAIL}>`;

        logger.debug(`Committing in the name of: ${author}`);
        return this.executeShell(`git commit --author "${author}" -m "${message}"`, {
            env: {
                'GIT_COMMITTER_NAME': GIT_AUTHOR_NAME,
                'GIT_COMMITTER_EMAIL': GIT_AUTHOR_EMAIL,
            },
        })
        .then(() => {
            logger.debug(`There were new changes to commit.`);
            return true;
        })
        .catch((err) => {
            logger.debug(`There were no changes to commit.`);
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

export default UploadDataJob;