import { GRAPH_PATH } from './config';
import { NEW_LINE_REGEXP } from './constants';
import logger from './logger';
import Session from './models/sessions/Session';
import PerformanceGraph from './models/graphs/PerformanceGraph';
import { Log } from './types';
import { readFile } from './utils/file';
import SessionHistory from './models/sessions/SessionHistory';
import { unique } from './utils/array';
import { getCountsDict } from './utils/math';

export const parseLogs = async (filepath: string) => {
    const file = await readFile(filepath);

    const logs = file
        .split(NEW_LINE_REGEXP)
        .filter(Boolean)
        .map(line => JSON.parse(line) as Log);

    const history = new SessionHistory();
    let session: Session;

    logs.forEach((log: Log) => {

        // Session started
        if (log.msg.includes(Session.getStartText())) {
            session = Session.create()
            session.setStart(new Date(log.time));
        }

        // Session is open: store log
        if (session.isOpen()) {
            session.pushLog(log);
        }

        // Session ended
        if (log.msg.includes(Session.getEndText())) {
            session.setEnd(new Date(log.time));
            history.push(session);
        }
    });

    const completeSessions = history.get()
        .filter((session: Session) => session.isClosed());

    const errors = history.get()
        .filter((session: Session) => session.getErrors().length > 0)
        .map((session: Session) => session.getErrors().join('|'));

    logger.debug(getCountsDict(errors), `Errors:`);

    const results = completeSessions.map((session: Session) => {
        return {
            time: session.getStart()!,
            duration: session.getDuration()!,
        };
    });

    const graph = new PerformanceGraph(GRAPH_PATH);
    await graph.draw(results);
}