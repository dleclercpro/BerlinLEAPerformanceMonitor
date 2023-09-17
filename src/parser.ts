import { IMG_DIR } from './config';
import { NEW_LINE_REGEXP } from './constants';
import logger from './logger';
import NoAppointmentsGraph from './models/graphs/NoAppointmentsGraph';
import { Locale, Log } from './types';
import { readFile } from './utils/file';
import { getCountsDict, getRange } from './utils/math';
import SessionHistoryBuilder from './models/sessions/SessionHistoryBuilder';
import { formatDate, formatDateByLocale, formatDateForFilename } from './utils/locale';

export const parseLogs = async (filepath: string) => {
    const file = await readFile(filepath);

    const logs = file
        .split(NEW_LINE_REGEXP)
        .filter(Boolean)
        .map(line => JSON.parse(line) as Log);

    const history = SessionHistoryBuilder.build(logs);

    const graph = new NoAppointmentsGraph(`${IMG_DIR}/user-session-duration.png`);
    await graph.draw(history);
    await graph.store();

    const errors = history.getErrors();
    logger.debug(getCountsDict(errors), `Errors experienced:`);

    const successTimes = history
        .getSuccesses()
        .map(session => formatDateForFilename(session.getEndTime()))

    logger.info(successTimes, `Time(s) at which an appointment was momentarily available:`);



    // FIXME
    // const hours = getRange(24);
    // const hourlyErrors: ErrorDict[] = [];

    // const INITIAL_ERROR_COUNTS: Record<string, number> = errors.reduce((prev, err) => {
    //     return { ...prev, [err]: 0 };
    // }, {});

    // hours.forEach(hour => {
    //     const hourErrorCounts = { ...INITIAL_ERROR_COUNTS };

    //     const hourSessions = reasonableSessions
    //         .filter(session => session.getStartTime().getHours() === hour);

    //     hourSessions.forEach(session => {
    //         session.getErrors().forEach(error => {
    //             hourErrorCounts[error] += 1;
    //         });
    //     });

    //     hourlyErrors.push(hourErrorCounts);
    // });

    // logger.debug(hourlyErrors);
}