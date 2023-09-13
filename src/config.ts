import path from 'path';
import { loadEnvironment } from './utils/env';

export const ROOT_DIR = path.resolve(__dirname, '..');
export const ENV = loadEnvironment();
export const LOCALE = 'en';