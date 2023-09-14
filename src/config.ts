import { loadEnvironment } from './utils/env';

export const ENV = loadEnvironment();
export const LOCALE = 'en';

export const LOGS_PATH = `${process.cwd()}/data/app.log`;
export const ALARM_PATH = `${process.cwd()}/resources/alarm.wav`;

export const ENABLE_POLLING = [true, 'true'].includes(process.env.ENABLE_POLLING!);
export const ENABLE_PARSING = [true, 'true'].includes(process.env.ENABLE_PARSING!);

export const CITIZENSHIP = process.env.CITIZENSHIP!;
export const NUMBER_OF_APPLICANTS = process.env.NUMBER_OF_APPLICANTS!;
export const WITH_RELATIVES = process.env.WITH_RELATIVES!;