import { IMG_DIR } from './config';
import { HOUR, NEW_LINE_REGEXP } from './constants';
import logger from './logger';
import Session from './models/sessions/Session';
import SessionDurationGraph from './models/graphs/SessionDurationGraph';
import { Log } from './types';
import { readFile } from './utils/file';
import { getCountsDict, getRange } from './utils/math';
import SessionHistoryBuilder from './models/sessions/SessionHistoryBuilder';

interface ErrorDict {

}

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
    const sessions = history
        .getSessions()
        .filter(session => !session.hasUnexpectedErrors());

    const reasonableSessions = sessions
        .filter(isSessionLengthReasonable);
    const unreasonableSessions = sessions
        .filter(session => !isSessionLengthReasonable(session));

    logger.info(`Found ${(unreasonableSessions.length)}/${sessions.length} sessions of unreasonable length.`);

    const results = reasonableSessions.map((session: Session) => {
        return {
            start: session.getStart()!,
            duration: session.getDuration()!,
        };
    });

    const graph = new SessionDurationGraph(`${IMG_DIR}/user-session-duration.png`);
    await graph.draw(results);
    await graph.store();

    const errors = history.getErrorsAsString();
    logger.debug(getCountsDict(errors), `Errors:`);



    // FIXME
    const hours = getRange(24);
    const hourlyErrors: ErrorDict[] = [];

    const INITIAL_ERROR_COUNTS = errors.reduce((prev, err) => {
        return { ...prev, [err]: 0 };
    }, {});

    hours.forEach(hour => {
        const errorCounts = { ...INITIAL_ERROR_COUNTS };

        hourlyErrors.push(errorCounts);
    });

    // logger.debug(hourlyErrors);
}