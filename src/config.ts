import { Locale } from './types';
import { getEnvironmentVariable, loadEnvironment } from './utils/env';
import { parseBooleanText } from './utils/string';
import { WEEKDAY_COLORS_1, WEEKDAY_COLORS_2, WEEKDAY_COLORS_4 } from './constants';

export const ENV = loadEnvironment();
export const LOCALE = Locale.DE;

export const LOGS_DIR = `${process.cwd()}/data/logs`;
export const IMG_DIR = `${process.cwd()}/data/img`;
export const SCREENSHOTS_DIR = `${process.cwd()}/data/screenshots`;

export const LOGS_PATH = `${LOGS_DIR}/app.log`;
export const ALARM_PATH = `${process.cwd()}/resources/alarm.wav`;
export const TEST_ALARM = parseBooleanText(getEnvironmentVariable('TEST_ALARM'));

export const LONG_DATE_TIME_FORMAT_OPTIONS = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
} as Intl.DateTimeFormatOptions;

export const CITIZENSHIP = getEnvironmentVariable('CITIZENSHIP');
export const NUMBER_OF_APPLICANTS = getEnvironmentVariable('NUMBER_OF_APPLICANTS');
export const WITH_RELATIVES = getEnvironmentVariable('WITH_RELATIVES');

export const WEEKDAY_COLORS = WEEKDAY_COLORS_1;