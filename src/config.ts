import { Locale } from './types';
import { getEnvironmentVariable, loadEnvironment } from './utils/env';
import { parseBooleanText } from './utils/string';

export const ENV = loadEnvironment();
export const LOCALE = Locale.DE;

export const LOGS_DIR = `${process.cwd()}/data/logs`;
export const IMG_DIR = `${process.cwd()}/data/img`;

export const LOGS_PATH = `${LOGS_DIR}/app.log`;
export const ALARM_PATH = `${process.cwd()}/resources/alarm.wav`;

export const TEST_ALARM = parseBooleanText(getEnvironmentVariable('TEST_ALARM'));

export const CITIZENSHIP = getEnvironmentVariable('CITIZENSHIP');
export const NUMBER_OF_APPLICANTS = getEnvironmentVariable('NUMBER_OF_APPLICANTS');
export const WITH_RELATIVES = getEnvironmentVariable('WITH_RELATIVES');