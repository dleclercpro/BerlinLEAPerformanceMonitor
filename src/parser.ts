import { IMG_DIR } from './config';
import { HOUR, NEW_LINE_REGEXP } from './constants';
import logger from './logger';
import Session from './models/sessions/Session';
import SessionDurationGraph from './models/graphs/SessionDurationGraph';
import { Log } from './types';
import { readFile } from './utils/file';
import { getCountsDict } from './utils/math';
import SessionHistoryBuilder from './models/sessions/SessionHistoryBuilder';

const isSessionLengthReasonable = (session: Session) => {
    return session.getDuration().smallerThan(HOUR);
}

export const parseLogs = async (filepath: string) => {
    const file = await readFile(filepath);

    const logs = file
        .split(NEW_LINE_REGEXP)
        .filter(Boolean)
        .map(line => JSON.parse(line) as Log);

    const history = SessionHistoryBuilder.build(logs);
    const sessions = history.getSessions();

    const reasonableSessions = sessions
        .filter(isSessionLengthReasonable);
    const unreasonableSessions = sessions
        .filter(session => !isSessionLengthReasonable(session));

    logger.info(`Found ${(unreasonableSessions.length)}/${sessions.length} sessions of unreasonable length.`);

    const errors = history.getErrors();
    logger.debug(getCountsDict(errors), `Errors:`);

    const results = reasonableSessions.map((session: Session) => {
        return {
            start: session.getStart()!,
            duration: session.getDuration()!,
        };
    });

    const graph = new SessionDurationGraph(`${IMG_DIR}/user-session-duration.png`);
    await graph.draw(results);
    await graph.store();
}