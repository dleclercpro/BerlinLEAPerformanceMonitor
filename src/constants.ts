import TimeDuration, { TimeUnit } from './models/TimeDuration';
import { Environment, Weekday } from './types';

export const NEW_LINE_REGEXP = /[\r\n]+/;
export const NEW_LINE = '\n';

export const HOMEPAGE_URL = 'http://otv.verwalt-berlin.de/';

export const ENVIRONMENTS = Object.values(Environment);
export const WEEKDAYS = Object.values(Weekday);

export const FIVE_MINUTES = new TimeDuration(5, TimeUnit.Minutes);
export const TEN_MINUTES = new TimeDuration(10, TimeUnit.Minutes);
export const ONE_HOUR = new TimeDuration(1, TimeUnit.Hours);
export const ONE_DAY = new TimeDuration(1, TimeUnit.Days);

export const NO_TIME = new TimeDuration(0, TimeUnit.Milliseconds);
export const VERY_SHORT_TIME = new TimeDuration(1, TimeUnit.Seconds);
export const SHORT_TIME = new TimeDuration(2, TimeUnit.Seconds);
export const MEDIUM_TIME = new TimeDuration(5, TimeUnit.Seconds);
export const LONG_TIME = new TimeDuration(10, TimeUnit.Seconds);
export const VERY_LONG_TIME = new TimeDuration(30, TimeUnit.Seconds);
export const VERY_VERY_LONG_TIME = new TimeDuration(1, TimeUnit.Minutes);
export const INFINITE_TIME = new TimeDuration(2, TimeUnit.Minutes); // More than 2 minutes in Internet terms is an eternity...

export const COLOR_GRAY = '#808080';

export const PALETTE_ROCKET = [COLOR_GRAY, '#35193e', '#701f57', '#ad1759', '#e13342', '#f37651', '#f6b48f'];
export const PALETTE_INFERNO = [COLOR_GRAY, '#280b53', '#65156e', '#9f2a63', '#d44842', '#f57d15', '#fac228'];
export const PALETTE_MAGMA = [COLOR_GRAY, '#221150', '#5f187f', '#982d80', '#d3436e', '#f8765c', '#febb81'];
export const PALETTE_PLASMA = [COLOR_GRAY, '#5302a3', '#8b0aa5', '#b83289', '#db5c68', '#f48849', '#febd2a'];
export const PALETTE_FLARE = [COLOR_GRAY, '#e98d6b', '#e3685c', '#d14a61', '#b13c6c', '#8f3371', '#6c2b6d'];

export enum LogMessages {
    UnknownError = 'An unknown error occurred.',
    ExpectedError = 'An expected error occured.',
    Success = `There are appointments available right now! :)`,
    Failure = `There are no appointments available at the moment. :'(`,
}