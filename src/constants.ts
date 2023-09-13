import MemorySize, { MemoryUnit } from './models/general/MemorySize';
import TimeDuration, { TimeUnit } from './models/general/TimeDuration';

export const NO_TIME_DURATION = new TimeDuration(0, TimeUnit.Milliseconds);
export const NO_MEMORY_SIZE = new MemorySize(0, MemoryUnit.Bytes);

export const BERLIN_LEA_URL = 'http://otv.verwalt-berlin.de/';