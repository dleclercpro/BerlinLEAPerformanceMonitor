import { DATA_DIR } from '../../config/file';
import { LOCALE } from '../../config/locale';
import logger from '../../logger';
import { GitAuthor, GitRemote } from '../../types';
import { GitCommands } from '../../utils/git';
import { getTimeZone } from '../../utils/time';
import Job from './Job';

class GitJob extends Job {
    protected name: string = 'GitJob';
    
    protected remote: GitRemote;
    protected author: GitAuthor;

    public constructor(remote: GitRemote, author: GitAuthor) {
        super();

        this.remote = remote;
        this.author = author;
    }

    public async execute() {
        if (!await this.hasRemote()) {
            await this.addRemote(this.remote);
        }
        else if (!await this.isRemoteUrlValid()) {
            await this.setRemoteUrl(this.remote.url);
        }

        await this.add();
        await this.commit(`New data: ${new Date().toLocaleString(LOCALE)} [${getTimeZone()}]`);
        await this.push();
    }

    protected async hasRemote() {
        return await this.getRemoteUrl() !== '';
    }

    protected async addRemote(remote: GitRemote) {
        logger.trace(`Adding Git remote: ${remote.name}`);
        await this.executeShell(GitCommands.AddRemote(remote.name, remote.url));
    }

    protected async isRemoteUrlValid() {
        logger.trace(`Validating URL for remote: ${this.remote.name}`);
        const url = await this.getRemoteUrl();

        return url === this.remote.url;
    }

    protected async getRemoteUrl() {
        logger.trace(`Getting URL for Git remote: ${this.remote.name}`);
        return this.executeShell(GitCommands.GetRemoteUrl(this.remote.name))
            .catch(() => '');
    }

    protected async setRemoteUrl(url: string) {
        logger.trace(`Setting URL for Git remote: ${this.remote.name}`);
        await this.executeShell(GitCommands.SetRemoteUrl(this.remote.name, this.remote.url));
    }

    protected async pull() {
        logger.trace(`Pulling from remote: ${this.remote.name}`);
        await this.executeShell(GitCommands.Pull());
    }

    protected async add() {
        logger.trace(`Adding data to commit.`);
        await this.executeShell(GitCommands.Add(DATA_DIR));
    }

    protected async commit(message: string) {
        logger.trace(`Committing in the name of: ${this.author.name}`);        
        this.executeShell(GitCommands.Commit(message, this.author), {
            env: {
                GIT_COMMITTER_NAME: this.author.name,
                GIT_COMMITTER_EMAIL: this.author.email,
            },
        });
    }

    protected async push() {
        logger.trace(`Pushing to remote: ${this.remote.name}`);
        await this.executeShell(GitCommands.Push(this.remote.name));
    }
}

export default GitJob;