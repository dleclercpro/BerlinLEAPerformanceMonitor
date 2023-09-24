import { Environment } from '../types';
import { name, version } from '../../package.json';
import Release from '../models/Release';

export const PACKAGE_NAME = name;
export const PACKAGE_VERSION = version;
export const ENVIRONMENTS = Object.values(Environment);

export const NEW_LINE_REGEXP = /[\r\n]+/;
export const NEW_LINE = '\n';

export const RELEASE_ZERO = new Release(0, 0, 0);

export enum LogMessage {
    KnownEvent = 'A known event occurred.',
    UnknownEvent = 'An unknown event occurred.',
    Success = `There are appointments available right now! :)`,
    Failure = `There are no appointments available at the moment. :'(`,
}