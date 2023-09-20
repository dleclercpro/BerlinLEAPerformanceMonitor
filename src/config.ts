import { Locale } from './types';
import { getEnvironmentVariable, getTerminalArgs, loadEnvironment } from './utils/env';
import { parseBooleanText } from './utils/string';
import { PALETTE_INFERNO, PALETTE_MAGMA, PALETTE_PLASMA } from './constants/colors';
import { NoAppointmentsError, NoInformationError, InternalServerError, ElementMissingFromPageError, InfiniteSpinnerError, UIError, BackToFindAppointmentPageError, ConstructionWorkError } from './errors';

export const ENV = loadEnvironment();
export const LOCALE = Locale.DE;

export const { POLL, ANALYZE, ENDLESS, UPLOAD } = getTerminalArgs();

export const DATA_DIR = `${process.cwd()}/data`;
export const LOGS_DIR = `${DATA_DIR}/logs`;
export const IMG_DIR = `${DATA_DIR}/img`;
export const SCREENSHOTS_DIR = `${DATA_DIR}/screenshots`;

export const LOGS_PATH = `${LOGS_DIR}/app.log`;
export const ALARM_PATH = `${process.cwd()}/resources/alarm.wav`;
export const TEST_ALARM = parseBooleanText(getEnvironmentVariable('TEST_ALARM'));

export const N_ALARMS_ON_SUCCESS = 20;

export const GIT_REMOTE = getEnvironmentVariable('GIT_REMOTE');
export const GIT_AUTHOR_NAME = getEnvironmentVariable('GIT_AUTHOR_NAME');
export const GIT_AUTHOR_EMAIL = getEnvironmentVariable('GIT_AUTHOR_EMAIL');

export const GITHUB_USER = getEnvironmentVariable('GITHUB_USER');
export const GITHUB_REPO_OWNER = getEnvironmentVariable('GITHUB_REPO_OWNER');
export const GITHUB_REPO = getEnvironmentVariable('GITHUB_REPO');
export const GITHUB_TOKEN = getEnvironmentVariable('GITHUB_TOKEN');

export const CITIZENSHIP = getEnvironmentVariable('CITIZENSHIP');
export const NUMBER_OF_APPLICANTS = getEnvironmentVariable('NUMBER_OF_APPLICANTS');
export const WITH_RELATIVES = getEnvironmentVariable('WITH_RELATIVES');

export const ERROR_COLORS = PALETTE_MAGMA;
export const WEEKDAY_COLORS = PALETTE_MAGMA;

export const LONG_DATE_TIME_FORMAT_OPTIONS = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
} as Intl.DateTimeFormatOptions;

export const KNOWN_UNEXPECTED_ERRORS = [
    NoInformationError,
    ConstructionWorkError,
    BackToFindAppointmentPageError,
    InternalServerError,
    ElementMissingFromPageError,
    InfiniteSpinnerError,
    UIError,
];

export const KNOWN_ERRORS = [
    ...KNOWN_UNEXPECTED_ERRORS,
    NoAppointmentsError,
];