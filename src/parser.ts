import { NEW_LINE_REGEXP } from './constants';
import logger from './logger';
import TimeDuration, { TimeUnit } from './models/TimeDuration';
import { Log } from './types';
import { getLast } from './utils/array';
import { readFile } from './utils/file'

interface Session {
    start?: number,
    end?: number,
    logs: Log[],
    errors: string[],
}

export const parseLogs = async (filepath: string) => {
    const file = await readFile(filepath);

    const logs = file
        .split(NEW_LINE_REGEXP)
        .filter(Boolean)
        .map(line => JSON.parse(line) as Log);

    const sessions: Session[] = [{ logs: [], errors: [] }];
    const getCurrentSession = () => getLast(sessions);
    let currentSession = getCurrentSession();

    logs.forEach((log: Log) => {

        // Session started
        if (log.msg.includes('[START]')) {

            // Last session wasn't complete: remove it
            if (!currentSession.start || !currentSession.end) {
                sessions.slice(0, -1);
            }

            // Create new session
            sessions.push({
                start: log.time,
                end: undefined,
                logs: [],
                errors: [],
            });
            
            // Update current session pointer
            currentSession = getCurrentSession();
        }

        // Session is open: store log
        if (currentSession.start && !currentSession.end) {
            currentSession.logs.push(log);

            // Look for errors
            if (log.level >= 50) {
                currentSession.errors.push(log.msg);
            }
        }

        // Session ended
        if (log.msg.includes('[END]')) {

            // Current session was already ended (?): remove it
            if (currentSession.end) {
                sessions.slice(0, -1);
                return;
            }
            
            currentSession.end = log.time;
        }
    });

    sessions
        .filter((session: Session) => session.start && session.end)
        .forEach((session: Session, i: number) => {
            const duration = new TimeDuration(session.end! - session.start!, TimeUnit.Milliseconds).format();
            
            logger.debug(session.logs.map(log => log.msg), `Session ${i} (${duration}):`);
            logger.debug(`Session errors: ${session.errors}`);
        });
}