import { NEW_LINE } from '../../constants';
import logger from '../../logger';
import { getLastValue } from '../../utils/array';
import { writeFile } from '../../utils/file';
import { sum } from '../../utils/math';
import CompleteSession from './CompleteSession';
import SessionHistory from './SessionHistory';

class SessionHistoryExporter {
    private static instance?: SessionHistoryExporter;

    private constructor () {

    }

    public static getInstance() {
        if (!SessionHistoryExporter.instance) {
            SessionHistoryExporter.instance = new SessionHistoryExporter();
        }
        return SessionHistoryExporter.instance;
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
                const newLogs = [...prevLogs, ...session.getLogs().map(log => log.toString())];

                logger.debug(`Converted ${newLogs.length} logs to string.`);

                return newLogs;

            }, [] as string[]);

        const data = lines.join(NEW_LINE) + NEW_LINE;
        
        await writeFile(filepath, data);
    }
}

export default SessionHistoryExporter.getInstance();