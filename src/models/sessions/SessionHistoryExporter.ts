import logger from '../../logger';
import { getLastValue } from '../../utils/array';
import { writeFile } from '../../utils/file';
import { sum } from '../../utils/math';
import { logToText } from '../../utils/parsing';
import CompleteSession from './CompleteSession';
import SessionHistory from './SessionHistory';

class SessionHistoryExporter {
    private static instance?: SessionHistoryExporter;

    private constructor () {

    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new SessionHistoryExporter();
        }
        return this.instance;
    }

    public async exportToLogFile(filepath: string, history: SessionHistory) {
        if (!filepath.endsWith('.log')) {
            const ext = getLastValue(filepath.split('.'));
            throw new Error(`Invalid file extension for export: ${ext}`);
        }

        const sessionCount = history.getSize();
        const logCount = sum(history.getSessions().map(session => session.getLogs().length));

        logger.debug(`Exporting session history to: ${filepath}`);
        logger.debug(`Found ${logCount} logs in ${sessionCount} sessions.`);
        
        const lines = history.getSessions()
            .reduce((prevLogs: string[], session: CompleteSession) => {
                const newLogs = [...prevLogs, ...session.getLogs().map(logToText)];

                logger.debug(`Converted ${newLogs.length} logs to string.`);

                return newLogs;

            }, [] as string[]);
        
        await writeFile(filepath, lines.join('\n') + '\n');
    }
}

export default SessionHistoryExporter.getInstance();