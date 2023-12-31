import MemorySize from '../models/units/MemorySize';
import { MemoryUnit } from '../types';
import { BOT } from './bot';

export const RESOURCES_DIR = `${process.cwd()}/resources`;
export const DATA_DIR = BOT ? `${process.cwd()}/data/production` : `${process.cwd()}/data/local`;

export const LOGS_DIR = `${DATA_DIR}/logs`;
export const IMG_DIR = `${DATA_DIR}/img`;
export const SCREENSHOTS_DIR = `${DATA_DIR}/screenshots`;

export const LOGS_FILEPATH = `${LOGS_DIR}/app.log`;
export const ALARM_FILEPATH = `${RESOURCES_DIR}/alarm.wav`;

export const REQUIRED_DISK_SPACE = new MemorySize(1, MemoryUnit.Gigabytes);