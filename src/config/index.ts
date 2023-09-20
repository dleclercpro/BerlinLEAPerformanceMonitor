import { getEnvironmentVariable, getTerminalArgs, loadEnvironment } from '../utils/env';
import { parseBooleanText } from '../utils/string';
import { FIVE_MINUTES } from '../constants/times';

export const ENV = loadEnvironment();

export const { POLL, ANALYZE, ENDLESS, UPLOAD } = getTerminalArgs();

export const DATA_DIR = `${process.cwd()}/data`;
export const LOGS_DIR = `${DATA_DIR}/logs`;
export const IMG_DIR = `${DATA_DIR}/img`;
export const SCREENSHOTS_DIR = `${DATA_DIR}/screenshots`;

export const LOGS_PATH = `${LOGS_DIR}/app.log`;
export const ALARM_PATH = `${process.cwd()}/resources/alarm.wav`;
export const TEST_ALARM = parseBooleanText(getEnvironmentVariable('TEST_ALARM'));

export const N_ALARMS_ON_SUCCESS = 20;

export const CITIZENSHIP = getEnvironmentVariable('CITIZENSHIP');
export const NUMBER_OF_APPLICANTS = getEnvironmentVariable('NUMBER_OF_APPLICANTS');
export const WITH_RELATIVES = getEnvironmentVariable('WITH_RELATIVES');

export const LENGTHY_SESSION_DURATION = FIVE_MINUTES;