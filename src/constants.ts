import MemorySize, { MemoryUnit } from './models/general/MemorySize';
import TimeDuration, { TimeUnit } from './models/general/TimeDuration';

export const NO_TIME_DURATION = new TimeDuration(0, TimeUnit.Milliseconds);
export const NO_MEMORY_SIZE = new MemorySize(0, MemoryUnit.Bytes);

export const HOMEPAGE_URL = 'http://otv.verwalt-berlin.de/';

export const SHORT_TIME = new TimeDuration(2, TimeUnit.Seconds);
export const MEDIUM_TIME = new TimeDuration(5, TimeUnit.Seconds);
export const LONG_TIME = new TimeDuration(10, TimeUnit.Seconds);
export const VERY_TIME = new TimeDuration(30, TimeUnit.Seconds);