import { Locale, TimeUnit } from './types';
import { getEnvironmentVariable, loadEnvironment } from './utils/env';
import { parseBooleanText } from './utils/string';
import { PALETTE_INFERNO, PALETTE_MAGMA, PALETTE_PLASMA } from './constants/colors';
import { NoAppointmentsError, NoInformationError, InternalServerError, ElementMissingFromPageError, InfiniteSpinnerError, UIError, BackToFindAppointmentPageError, ConstructionWorkError } from './errors';
import TimeDuration from './models/TimeDuration';

export const ENV = loadEnvironment();
export const LOCALE = Locale.DE;

export const LOGS_DIR = `${process.cwd()}/data/logs`;
export const IMG_DIR = `${process.cwd()}/data/img`;
export const SCREENSHOTS_DIR = `${process.cwd()}/data/screenshots`;

export const LOGS_PATH = `${LOGS_DIR}/app.log`;
export const ALARM_PATH = `${process.cwd()}/resources/alarm.wav`;
export const TEST_ALARM = parseBooleanText(getEnvironmentVariable('TEST_ALARM'));

export const N_ALARMS = 20;

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