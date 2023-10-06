import { writeFileSync } from 'fs';
import { LOGS_DIR, LOGS_FILEPATH } from '../../config/file';
import { formatDateForFilename } from '../../utils/locale';
import { parseLogs } from '../../utils/parsing';
import { getMidnightInUTC } from '../../utils/time';
import logger from '../../logger';
import { NEW_LINE } from '../../constants';
import Log from './Log';

type LogFiles = Record<string, Log[]>;

class LogRotater {
    private static instance?: LogRotater;
    
    protected logsFilepath: string = LOGS_FILEPATH;

    private constructor() {

    }

    public static getInstance() {
        if (!LogRotater.instance) {
            LogRotater.instance = new LogRotater();
        }
        return LogRotater.instance;
    }

    public async rotate() {
        const now = new Date();
        const midnight = getMidnightInUTC(now);

        const logs = await parseLogs(this.logsFilepath);

        const prevFiles: LogFiles = {};
        const nextFiles: LogFiles = {};

        // Differentiate between logs in the past, and logs today
        logs.forEach((log: Log) => {
            const date = log.getTime();
            const filepath = this.getFilepathForDate(date);

            // Ignore today's logs: they stay in the default 'app.log'
            // output file
            const files = date < midnight ? prevFiles : nextFiles;

            if (!(filepath in files)) {
                files[filepath] = [];
            }

            files[filepath].push(log);
        });

        logger.info(`Rotating logs...`);

        // Store previous days in individual log files
        for (const [filepath, logs] of Object.entries(prevFiles)) {
            const data = logs
                .map(log => log.toString())
                .join(NEW_LINE) + NEW_LINE;

            // Write synchronously to avoid other parts of the code
            // logging to the default output file during rotation
            writeFileSync(filepath, data);
        }

        // Overwrite default output log file 'app.log' with only
        // logs from current day
        const dataFromToday = nextFiles[this.getFilepathForDate(now)]
            .map(log => log.toString())
            .join(NEW_LINE) + NEW_LINE;

        writeFileSync(LOGS_FILEPATH, dataFromToday);

        logger.info(`Rotated logs.`);
    }

    protected getFilepathForDate(date: Date) {
        const filename = formatDateForFilename(date, { day: true, time: false });

        return `${LOGS_DIR}/${filename}.log`;
    }
}

export default LogRotater.getInstance();