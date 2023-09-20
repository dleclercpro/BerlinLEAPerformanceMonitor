import { DATA_DIR } from '../../config';
import logger from '../../logger';
import { GitAuthor, GitRemote } from '../../types';
import Job from './Job';



const GitCommands = {
    Add: (dir: string) => `git add ${dir}`,
    AddRemote: (remote: string, url: string) => `git remote add -t master -m master -f ${remote} ${url}`,
    GetRemoteUrl: (url: string) => `git remote get-url ${url}`,
    SetRemoteUrl: (remote: string, url: string) => `git remote set-url ${remote} ${url}`,
    Pull: () => `git pull`,
    Commit: (message: string, author: GitAuthor) => `git commit --author "${author.name} <${author.email}>" -m "${message}"`,
    Push: (remote: string) => `git push --repo ${remote}`,
}



class GitJob extends Job {
    protected name: string = 'UploadData';
    
    protected remote: GitRemote;
    protected author: GitAuthor;

    public constructor(remote: GitRemote, author: GitAuthor) {
        super();

        this.remote = remote;
        this.author = author;
    }

    public async execute() {
        if (!await this.isRemoteUrlValid()) {
            await this.setRemoteUrl(this.remote.url);
        }

        if (!await this.hasRemote()) {
            await this.addRemote(this.remote);
        }

        if (await this.add() && await this.commit()) {
            await this.push();            
        }
    }

    protected async hasRemote() {
        return await this.getRemoteUrl() !== '';
    }

    protected async isRemoteUrlValid() {
        return await this.getRemoteUrl() === this.remote.url;
    }

    protected async getRemoteUrl() {
        logger.trace(`Getting URL for Git remote: ${this.remote.name}`);
    
        try {
            return this.executeShell(GitCommands.GetRemoteUrl(this.remote.name));

        } catch (err) {
            return '';
        }
    }

    protected async setRemoteUrl(url: string) {

        // Update URL in stored remote object
        this.remote.url = url;

        logger.trace(`Setting URL for Git remote: ${this.remote.name}`);
        await this.executeShell(GitCommands.SetRemoteUrl(this.remote.name, this.remote.url));
    }

    protected async addRemote(remote: GitRemote) {
        logger.trace(`Adding Git remote: ${remote.name}`);
        await this.executeShell(GitCommands.AddRemote(remote.name, remote.url));
    }

    protected async add() {
        logger.trace(`Adding data to commit.`);

        try {
            await this.executeShell(GitCommands.Add(DATA_DIR));

            logger.trace(`Adding data to next commit succeeded.`);
            return true;
        
        } catch (err) {
            logger.trace(`Adding data to next commit did not succeed.`);
            return false;
        }
    }

    protected async commit() {
        const message = `New data.`;


        try {
            logger.trace(`Committing in the name of: ${this.author.name}`);
            
            this.executeShell(GitCommands.Commit(message, this.author), {
                env: {
                    'GIT_COMMITTER_NAME': this.author.name,
                    'GIT_COMMITTER_EMAIL': this.author.email,
                },
            });

            logger.trace(`There were new changes to commit.`);
            return true;
        
        } catch (err) {
            logger.trace(`There were no changes to commit.`);
            return false;
        }
    }

    protected async pull() {
        logger.trace(`Pulling from remote: ${this.remote.name}`);

        await this.executeShell(GitCommands.Pull());
    }

    protected async push() {
        logger.trace(`Pushing to remote: ${this.remote.name}`);

        await this.executeShell(GitCommands.Push(this.remote.name));
    }
}

export default GitJob;