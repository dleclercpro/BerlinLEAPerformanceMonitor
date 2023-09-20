import { getEnvironmentVariable } from '../utils/env';

export const GIT_AUTHOR_NAME = getEnvironmentVariable('GIT_AUTHOR_NAME');
export const GIT_AUTHOR_EMAIL = getEnvironmentVariable('GIT_AUTHOR_EMAIL');
export const GIT_AUTHOR = { name: GIT_AUTHOR_NAME, email: GIT_AUTHOR_EMAIL };

export const GITHUB_USER = getEnvironmentVariable('GITHUB_USER');
export const GITHUB_REPO_OWNER = getEnvironmentVariable('GITHUB_REPO_OWNER');
export const GITHUB_REPO = getEnvironmentVariable('GITHUB_REPO');
export const GITHUB_TOKEN = getEnvironmentVariable('GITHUB_TOKEN');

export const GIT_REMOTE_NAME = getEnvironmentVariable('GIT_REMOTE_NAME');
export const GIT_REMOTE = { name: GIT_REMOTE_NAME, url: `https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO}.git` };