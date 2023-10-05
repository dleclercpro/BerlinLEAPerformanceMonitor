import { NEW_LINE_REGEXP } from '../constants';
import logger from '../logger';
import Release from '../models/Release';
import { Log } from '../types';
import { readFile } from './file';



const isTextLog = (line: string) => {
    return line.startsWith('{') && line.endsWith('}');
}

const hasLogMessage = (log: Log) => {
    return !!log && !!log.msg;
}

export const textToLog = (line: string, i: number): Log => {
    const { version, ...log } = JSON.parse(line);
    return {
        ...log,
        line: i + 1,
        version: Release.fromString(version),
    };
}

export const logToText = (log: Log) => {
    return (`{` +
        `"level":${log.level},` +
        `"time":"${log.time}",` +
        `"pid":${log.pid},` +
        `"hostname":"${log.hostname}",` +
        `"version":"${log.version.toString()}",` +
        (log.err ? `"err":"${log.err}",` : '') +
        `"msg":"${log.msg}"` +
        `}`
    );
};



export const parseLogs = async (filepath: string, since?: Date | Release) => {
    logger.info(`Reading logs from: ${filepath}`);

    if (since) {
        if (since instanceof Date) {
            logger.info(`Keeping logs newer than: ${since}`);
        } else {
            logger.info(`Keeping logs with release version higher or equal to: ${since.toString()}`);
        }
    }

    const file = await readFile(filepath);

    const logs: Log[] = file
        .split(NEW_LINE_REGEXP)
        .filter(isTextLog)
        .map(textToLog)
        .filter((log: Log) => {
            if (since instanceof Date) {
                return new Date(log.time) >= since;
            }
            if (since instanceof Release) {
                return log.version.greaterThanOrEquals(since);
            }
            return true;
        })
        .filter(hasLogMessage); // Every log should have a message

    logger.info(`Parsed ${logs.length} valid log entries.`);

    return logs;
}