import { GRAPH_PATH } from './config';
import { NEW_LINE_REGEXP } from './constants';
import logger from './logger';
import Session from './models/Session';
import PerformanceGraph from './models/graphs/PerformanceGraph';
import { Log } from './types';
import { getLast } from './utils/array';
import { readFile } from './utils/file';

export const parseLogs = async (filepath: string) => {
    const file = await readFile(filepath);

    const logs = file
        .split(NEW_LINE_REGEXP)
        .filter(Boolean)
        .map(line => JSON.parse(line) as Log);

    let sessionId = 0;
    const sessions: Session[] = [new Session(sessionId.toString())];
    const getCurrentSession = () => getLast(sessions);
    let currentSession = getCurrentSession();

    logs.forEach((log: Log) => {

        // Session started
        if (log.msg.includes(Session.getStartText())) {

            // Last session wasn't complete: remove it
            if (!currentSession.getStart() || !currentSession.getEnd()) {
                logger.debug(`Ignoring incomplete session.`);

                sessions.slice(0, -1);
            }

            // Create new session
            sessionId += 1;
            sessions.push(new Session(sessionId.toString(), log.time));
            
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

    const completeSessions = sessions
        .filter((session: Session) => session.isComplete())

    completeSessions
        .forEach((session: Session, i: number, remainingSessions: Session[]) => {
            const sessionIdentifier = `Session ${i + 1}/${remainingSessions.length} (${session.getDuration().format()}):`;
            
            logger.debug(session.getLogs().map(log => log.msg), sessionIdentifier);
            logger.debug(session.getErrors(), `Errors:`);
        });

    const graph = new PerformanceGraph(GRAPH_PATH);
    await graph.draw(completeSessions.map((session: Session) => {
        return {
            time: session.getStart()!,
            duration: session.getDuration(),
        };
    }));
}