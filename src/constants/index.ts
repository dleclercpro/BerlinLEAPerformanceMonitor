import { Environment } from '../types';

export const ENVIRONMENTS = Object.values(Environment);

export const NEW_LINE_REGEXP = /[\r\n]+/;
export const NEW_LINE = '\n';

export enum LogMessage {
    UnknownError = 'An unknown error occurred.',
    KnownError = 'An expected error occurred.',
    Success = `There are appointments available right now! :)`,
    Failure = `There are no appointments available at the moment. :'(`,
}