import { Environment } from '../types';

export const NEW_LINE_REGEXP = /[\r\n]+/;
export const NEW_LINE = '\n';

export const HOMEPAGE_URL = 'http://otv.verwalt-berlin.de/';

export const ENVIRONMENTS = Object.values(Environment);

export enum LogMessages {
    UnknownError = 'An unknown error occurred.',
    ExpectedError = 'An expected error occurred.',
    Success = `There are appointments available right now! :)`,
    Failure = `There are no appointments available at the moment. :'(`,
}