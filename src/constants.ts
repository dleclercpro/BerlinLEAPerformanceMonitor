import TimeDuration, { TimeUnit } from './models/TimeDuration';

export const NEW_LINE_REGEXP = /[\r\n]+/;
export const NEW_LINE = '\n';

export const HOMEPAGE_URL = 'http://otv.verwalt-berlin.de/';

export const NO_TIME = new TimeDuration(0, TimeUnit.Milliseconds);
export const VERY_SHORT_TIME = new TimeDuration(1, TimeUnit.Seconds);
export const SHORT_TIME = new TimeDuration(2, TimeUnit.Seconds);
export const MEDIUM_TIME = new TimeDuration(5, TimeUnit.Seconds);
export const LONG_TIME = new TimeDuration(10, TimeUnit.Seconds);
export const VERY_LONG_TIME = new TimeDuration(30, TimeUnit.Seconds);
export const VERY_VERY_LONG_TIME = new TimeDuration(1, TimeUnit.Minutes);

export const HOUR = new TimeDuration(1, TimeUnit.Hours);