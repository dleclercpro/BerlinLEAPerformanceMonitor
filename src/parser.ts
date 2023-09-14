import { NEW_LINE_REGEXP } from './constants';
import Session from './models/Session';
import { Log } from './types';
import { getLast } from './utils/array';
import { readFile } from './utils/file';

export const parseLogs = async (filepath: string) => {
    const file = await readFile(filepath);

    const logs = file
        .split(NEW_LINE_REGEXP)
        .filter(Boolean)
        .map(line => JSON.parse(line) as Log);

    const sessions: Session[] = [new Session()];
    const getCurrentSession = () => getLast(sessions);
    let currentSession = getCurrentSession();

    logs.forEach((log: Log) => {

        // Session started
        if (log.msg.includes(Session.getStartText())) {

            // Last session wasn't complete: remove it
            if (!currentSession.getStart() || !currentSession.getEnd()) {
                console.log(`Ignoring incomplete session.`);

                sessions.slice(0, -1);
            }

            // Create new session
            sessions.push(new Session(log.time));
            
            // Update current session pointer
            currentSession = getCurrentSession();
        }

        // Session is open: store log
        if (currentSession.getStart() && !currentSession.getEnd()) {
            currentSession.logs.push(log);

            // Look for errors
            if (log.err) {
                currentSession.errors.push(log.err);
            }
        }

        // Session ended
        if (log.msg.includes(Session.getEndText())) {

            // Current session was already ended (?): remove it
            if (currentSession.getEnd()) {
                sessions.slice(0, -1);
                return;
            }
            
            currentSession.setEnd(log.time);
        }
    });

    sessions
        .filter((session: Session) => session.isComplete())
        .forEach((session: Session, i: number) => {
            console.log(session.getLogs().map(log => log.msg), `Session ${i} (${session.getDuration()}):`);
            console.log(session.getErrors(), `Session errors:`);
        });
}