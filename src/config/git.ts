import { getEnvironmentVariable } from '../utils/env';
import { BOT } from './bot';

export const GIT_BOT_NAME = getEnvironmentVariable('GIT_BOT_NAME', BOT);
export const GIT_BOT_EMAIL = getEnvironmentVariable('GIT_BOT_EMAIL', BOT);

export const GITHUB_BOT_USER = getEnvironmentVariable('GITHUB_BOT_USER', BOT);
export const GITHUB_REPO_OWNER = getEnvironmentVariable('GITHUB_REPO_OWNER', BOT);
export const GITHUB_REPO = getEnvironmentVariable('GITHUB_REPO', BOT);
export const GITHUB_BOT_TOKEN = getEnvironmentVariable('GITHUB_BOT_TOKEN', BOT);

export const GIT_BOT_REMOTE = getEnvironmentVariable('GIT_BOT_REMOTE', BOT);