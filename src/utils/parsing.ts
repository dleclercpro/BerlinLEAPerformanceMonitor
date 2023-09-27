import { NEW_LINE_REGEXP } from '../constants';
import logger from '../logger';
import { Log } from '../types';
import { readFile } from './file';



const isTextLog = (line: string) => line.startsWith('{') && line.endsWith('}');
const parseTextLog = (line: string, i: number): Log => ({ line: i + 1, ...JSON.parse(line) });
const hasLogMessage = (log: Log) => !!log && !!log.msg;



export const parseLogs = async (filepath: string) => {
    logger.info(`Reading logs from: ${filepath}`);

    const file = await readFile(filepath);

    const logs: Log[] = file
        .split(NEW_LINE_REGEXP)
        .filter(isTextLog)
        .map(parseTextLog)
        .filter(hasLogMessage); // Every log should have a message

    logger.info(`Parsed ${logs.length} valid log entries.`);

    return logs;
}