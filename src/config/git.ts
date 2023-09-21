import { getEnvironmentVariable } from '../utils/env';

export const GIT_BOT_NAME = getEnvironmentVariable('GIT_BOT_NAME');
export const GIT_BOT_EMAIL = getEnvironmentVariable('GIT_BOT_EMAIL');
export const GIT_AUTHOR = { name: GIT_BOT_NAME, email: GIT_BOT_EMAIL };

export const GITHUB_BOT_USER = getEnvironmentVariable('GITHUB_BOT_USER');
export const GITHUB_REPO_OWNER = getEnvironmentVariable('GITHUB_REPO_OWNER');
export const GITHUB_REPO = getEnvironmentVariable('GITHUB_REPO');
export const GITHUB_BOT_TOKEN = getEnvironmentVariable('GITHUB_BOT_TOKEN');

export const GIT_BOT_REMOTE = getEnvironmentVariable('GIT_BOT_REMOTE');
export const GIT_REMOTE = { name: GIT_BOT_REMOTE, url: `https://${GITHUB_BOT_USER}:${GITHUB_BOT_TOKEN}@github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO}.git` };