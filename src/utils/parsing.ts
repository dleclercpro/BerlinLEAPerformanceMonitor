import Log from '../models/logs/Log';
import { NEW_LINE_REGEXP } from '../constants';
import logger from '../logger';
import Release from '../models/Release';
import { readFile } from './file';
import pino from 'pino';

const LEVEL_MAP = pino.levels.values;



export const parseLogs = async (filepath: string, since?: Date | Release, level?: pino.Level) => {
    logger.trace(`Reading logs...`);

    if (since) {
        if (since instanceof Date) {
            logger.trace(`Keeping logs newer than: ${since}`);
        } else {
            logger.trace(`Keeping logs with release version higher or equal to: ${since.toString()}`);
        }
    }

    if (level) {
        logger.debug(`Keeping logs with level greater than or equal to: ${LEVEL_MAP[level]} (${level.toUpperCase()})`);
    }

    const file = await readFile(filepath);

    const rawLogs = file
        .split(NEW_LINE_REGEXP)
        .filter((line: string) => {
            return line.startsWith('{') && line.endsWith('}');
        })
        .map((line: string, index: number) => {
            return Log.fromText(line, index);
        })
        .filter(Boolean) as Log[];

    const logs = rawLogs
        .filter((log: Log) => level === undefined || log.getLevel() >= LEVEL_MAP[level])
        .filter((log: Log) => {
            if (since instanceof Date) {
                return log.getTime() >= since;
            }
            if (since instanceof Release) {
                return log.getVersion().greaterThanOrEquals(since);
            }
            return true;
        })
        .filter((log: Log) => log.hasMessage());

    if (logs.length > 0) {
        logger.trace(`Parsed ${logs.length} valid log entries.`);
    }

    return logs;
}