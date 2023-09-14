import { loadEnvironment } from './utils/env';

export const ENV = loadEnvironment();
export const LOCALE = 'en';
export const DEFAULT_LOG_LEVEL = 'trace';

export const LOGS_PATH = `${process.cwd()}/data/app.log`;
export const ALARM_PATH = `${process.cwd()}/resources/alarm.wav`;

export const TEST_ALARM = [true, 'true'].includes(process.env.TEST_ALARM!);

export const CITIZENSHIP = process.env.CITIZENSHIP!;
export const NUMBER_OF_APPLICANTS = process.env.NUMBER_OF_APPLICANTS!;
export const WITH_RELATIVES = process.env.WITH_RELATIVES!;