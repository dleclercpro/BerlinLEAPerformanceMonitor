import TimeDuration, { TimeUnit } from './models/TimeDuration';
import { Weekday } from './types';

export const NEW_LINE_REGEXP = /[\r\n]+/;
export const NEW_LINE = '\n';

export const HOMEPAGE_URL = 'http://otv.verwalt-berlin.de/';

export const WEEKDAYS = Object.values(Weekday);

export const NO_TIME = new TimeDuration(0, TimeUnit.Milliseconds);
export const VERY_SHORT_TIME = new TimeDuration(1, TimeUnit.Seconds);
export const SHORT_TIME = new TimeDuration(2, TimeUnit.Seconds);
export const MEDIUM_TIME = new TimeDuration(5, TimeUnit.Seconds);
export const LONG_TIME = new TimeDuration(10, TimeUnit.Seconds);
export const VERY_LONG_TIME = new TimeDuration(30, TimeUnit.Seconds);
export const VERY_VERY_LONG_TIME = new TimeDuration(1, TimeUnit.Minutes);

export const ONE_HOUR = new TimeDuration(1, TimeUnit.Hours);
export const FIVE_MINUTES = new TimeDuration(5, TimeUnit.Minutes);

export const WEEKDAY_COLORS_1 = ['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#000000','#a65628'];
export const WEEKDAY_COLORS_2 = ['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69'];
export const WEEKDAY_COLORS_3 = ['#66c2a5','#fc8d62','#8da0cb','#e78ac3','#a6d854','#ffd92f','#e5c494'];
export const WEEKDAY_COLORS_4 = ['#7fc97f','#beaed4','#fdc086','#ffff99','#386cb0','#f0027f','#bf5b17'];