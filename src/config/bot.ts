import { getTerminalArgs } from '../utils/env';

export const args = getTerminalArgs();

export const BOT = args.bot;

export const POLL = args.poll || args.bot;
export const ONCE = args.once && !args.bot;
export const ANALYZE = args.analyze || args.bot;
export const UPLOAD = BOT;