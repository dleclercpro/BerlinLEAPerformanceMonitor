import { EVERY_MINUTE_ZERO_AND_MINUTE_THIRTY, EVERY_NIGHT_AT_THREE } from '../constants/times';
import { getTerminalArgs } from '../utils/env';

export const args = getTerminalArgs();

export const BOT = args.bot;
export const POLL = args.poll || args.bot;
export const ONCE = args.once && !args.bot;
export const ANALYZE = args.analyze || args.bot;
export const CLEAN = args.clean;
export const UPLOAD = BOT;

export const BOT_JOB_FREQUENCY = EVERY_MINUTE_ZERO_AND_MINUTE_THIRTY;
export const LOG_ROTATION_JOB_FREQUENCY = EVERY_NIGHT_AT_THREE;