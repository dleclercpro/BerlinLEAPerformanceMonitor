import path from 'path';
import { loadEnvironment } from './utils/env';
import TimeDuration, { TimeUnit } from './models/TimeDuration';
import { NoAppointmentsError, InternalServerError, ElementMissingFromPageError, InfiniteSpinnerError, PageStructureIntegrityError } from './errors';

export const ROOT_DIR = path.resolve(__dirname, '..');
export const ENV = loadEnvironment();
export const LOCALE = 'en';

export const ZERO_TIME = new TimeDuration(0, TimeUnit.Milliseconds);

export const CITIZENSHIP = process.env.CITIZENSHIP!;
export const NUMBER_OF_APPLICANTS = process.env.NUMBER_OF_APPLICANTS!;
export const WITH_RELATIVES = process.env.WITH_RELATIVES!;

export const EXPECTED_ERRORS = [
    NoAppointmentsError,
    InternalServerError,
    ElementMissingFromPageError,
    InfiniteSpinnerError,
    PageStructureIntegrityError,
];