import { IMG_DIR } from '../config';
import { NEW_LINE_REGEXP, FIVE_MINUTES } from '../constants';
import logger from './logging';
import Session from '../models/sessions/Session';
import NoAppointmentsSessionLengthGraph from '../models/graphs/NoAppointmentsSessionLengthGraph';
import { Log } from '../types';
import { readFile } from './file';
import { getCountsDict, getRange } from './math';
import SessionHistoryBuilder from '../models/sessions/SessionHistoryBuilder';
import { NoAppointmentsError } from '../errors';

interface ErrorDict {

}

const isSessionLengthReasonable = (session: Session) => {
    return session.getDuration().smallerThan(FIVE_MINUTES);
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
    const endedInNoAppointmentsSessions = sessions
        .filter(session => {
            const errors = session.getErrors();

            return errors.length === 1 && errors[0] === NoAppointmentsError.name;
        })

    logger.info(`Found ${(unreasonableSessions.length)}/${sessions.length} sessions of unreasonable length.`);

    const graph = new NoAppointmentsSessionLengthGraph(`${IMG_DIR}/user-session-duration.png`);
    await graph.draw(endedInNoAppointmentsSessions);
    await graph.store();

    const errors = history.getErrorsAsString();
    logger.debug(getCountsDict(errors), `Errors:`);



    // FIXME
    const hours = getRange(24);
    const hourlyErrors: ErrorDict[] = [];

    const INITIAL_ERROR_COUNTS: Record<string, number> = errors.reduce((prev, err) => {
        return { ...prev, [err]: 0 };
    }, {});

    hours.forEach(hour => {
        const hourErrorCounts = { ...INITIAL_ERROR_COUNTS };

        const hourSessions = reasonableSessions
            .filter(session => session.getStart()!.getHours() === hour);

        hourSessions.forEach(session => {
            session.getErrors().forEach(error => {
                hourErrorCounts[error] += 1;
            });
        });

        hourlyErrors.push(hourErrorCounts);
    });

    logger.debug(hourlyErrors);
}