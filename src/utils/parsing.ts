import Log from '../Log';
import { NEW_LINE_REGEXP } from '../constants';
import logger from '../logger';
import Release from '../models/Release';
import { readFile } from './file';



export const parseLogs = async (filepath: string, since?: Date | Release) => {
    logger.trace(`Reading logs...`);

    if (since) {
        if (since instanceof Date) {
            logger.trace(`Keeping logs newer than: ${since}`);
        } else {
            logger.trace(`Keeping logs with release version higher or equal to: ${since.toString()}`);
        }
    }

    const file = await readFile(filepath);

    const logs: Log[] = file
        .split(NEW_LINE_REGEXP)
        .filter((line: string) => {
            return line.startsWith('{') && line.endsWith('}');
        })
        .map((line: string, index: number) => {
            return Log.fromText(line, index);
        })
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
        logger.debug(`Parsed ${logs.length} valid log entries.`);
    }

    return logs;
}