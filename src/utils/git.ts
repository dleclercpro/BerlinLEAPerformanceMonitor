import { GitAuthor } from '../types';

export const GitCommands = {
    Add: (dir: string) => `git add ${dir}`,
    AddRemote: (remote: string, url: string) => `git remote add -t master -m master -f ${remote} ${url}`,
    GetRemoteUrl: (remote: string) => `git remote get-url ${remote}`,
    SetRemoteUrl: (remote: string, url: string) => `git remote set-url ${remote} ${url}`,
    Pull: () => `git pull`,
    Commit: (message: string, author: GitAuthor) => `git commit --author "${author.name} <${author.email}>" -m "${message}"`,
    Push: (remote: string) => `git push --repo ${remote}`,
}