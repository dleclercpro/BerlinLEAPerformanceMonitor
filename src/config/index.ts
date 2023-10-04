import { getEnvironmentVariable, loadEnvironment } from '../utils/env';
import { parseBooleanText } from '../utils/string';
import { FIVE_MINUTES } from '../constants/times';
import { POLL } from './bot';
import Release from '../models/Release';

export const ENV = loadEnvironment();

export const RELEASE_MIN = new Release(0, 0, 0);
export const IGNORE_DAYS_WITH_EMPTY_BUCKETS = false;

export const HOMEPAGE_URL = 'http://otv.verwalt-berlin.de/';

export const N_ALARMS_ON_SUCCESS = 20;
export const TEST_ALARM = parseBooleanText(getEnvironmentVariable('TEST_ALARM', POLL) ?? 'false');

export const CITIZENSHIP = getEnvironmentVariable('CITIZENSHIP', POLL);
export const NUMBER_OF_APPLICANTS = getEnvironmentVariable('NUMBER_OF_APPLICANTS', POLL);
export const WITH_RELATIVES = getEnvironmentVariable('WITH_RELATIVES', POLL);

export const LENGTHY_SESSION_DURATION = FIVE_MINUTES;