import { IMG_DIR, LENGTHY_SESSION_DURATION } from './config';
import { LONG_DATE_TIME_FORMAT_OPTIONS } from './config/LocaleConfig'
import { NEW_LINE_REGEXP } from './constants';
import logger from './logger';
import UserSessionLengthUntilFailureGraph, { sessionFilterNoAppointmentsGraph } from './models/graphs/UserSessionLengthUntilFailureGraph';
import { Log, TimeUnit } from './types';
import { readFile } from './utils/file';
import SessionHistoryBuilder from './models/sessions/SessionHistoryBuilder';
import { formatDate, formatDateForFilename } from './utils/locale';
import UserSessionLengthUntilFailureBucketGraph from './models/graphs/UserSessionLengthUntilFailureBucketGraph';
import SessionHistory from './models/sessions/SessionHistory';
import ErrorPrevalenceOnWorkdaysBucketGraph from './models/graphs/ErrorPrevalenceOnWorkdaysBucketGraph';
import TimeDuration from './models/TimeDuration';
import { ONE_HOUR } from './constants/times';
import { isErrorKnown } from './utils/errors';
import ErrorLikelihoodOnWorkdaysBucketGraph from './models/graphs/ErrorLikelihoodOnWorkdaysBucketGraph';



const parseLogs = async (filepath: string) => {
    const file = await readFile(filepath);

    return file
        .split(NEW_LINE_REGEXP)
        .filter(Boolean)
        .map(line => JSON.parse(line) as Log);
}



const generateUserSessionLengthUntilFailureGraph = async (history: SessionHistory) => {
    if (history.getSize() < 2) throw new Error('Not enough data to plot graph.');

    const start = history.getEarliestSession()!.getStartTime();
    const end = history.getLatestSession()!.getEndTime();

    const title = [
        `Länge einer User-Session auf der Seite des Berliner LEAs, bis zur Fehlermeldung 'Es sind keine Termine frei.'`,
        `Es wurden alle User-Sessions, die Länger als ${LENGTHY_SESSION_DURATION.format()} waren, ignoriert.`,
        `Gesamtanzahl der User-Sessions: ${history.getSessions().filter(sessionFilterNoAppointmentsGraph).length}`,
        `Start: ${formatDate(start, LONG_DATE_TIME_FORMAT_OPTIONS)}`,
        `Ende: ${formatDate(end, LONG_DATE_TIME_FORMAT_OPTIONS)}`,
    ];

    const graph = new UserSessionLengthUntilFailureGraph(`${IMG_DIR}/user-session-duration.png`);
    await graph.draw(title, history);
    await graph.store();
}

const generateUserSessionLengthUntilFailureBucketGraph = async (history: SessionHistory) => {
    if (history.getSize() < 2) throw new Error('Not enough data to plot graph.');

    const start = history.getEarliestSession()!.getStartTime();
    const end = history.getLatestSession()!.getEndTime();

    const title = [
        `Durchnittliche Länge einer User-Session auf der Seite des Berliner LEAs, bis zur Fehlermeldung 'Es sind keine Termine frei.'`,
        `Bucket-Größe: ${history.getBucketSize().format()}`,
        `Start: ${formatDate(start, LONG_DATE_TIME_FORMAT_OPTIONS)}`,
        `Ende: ${formatDate(end, LONG_DATE_TIME_FORMAT_OPTIONS)}`,
    ];

    const graph = new UserSessionLengthUntilFailureBucketGraph(`${IMG_DIR}/user-session-duration-by-bucket.png`);
    await graph.draw(title, history);
    await graph.store();
}

const generateErrorPrevalenceOnWorkdaysBucketGraph = async (history: SessionHistory) => {
    if (history.getSize() < 2) throw new Error('Not enough data to plot graph.');

    const start = history.getEarliestSession()!.getStartTime();
    const end = history.getLatestSession()!.getEndTime();

    const totalErrorCount = history.getErrors().filter(isErrorKnown).length;

    const title = [
        `Prävalenz aller während einer User-Session erlebten Bugs zwischen Montag und Freitag auf der Seite des Berliner LEAs`,
        `Bucket-Größe: ${history.getBucketSize().format()}, Gesamtanzahl der gemessenen Bugs: ${totalErrorCount}`,
        `Start: ${formatDate(start, LONG_DATE_TIME_FORMAT_OPTIONS)}`,
        `Ende: ${formatDate(end, LONG_DATE_TIME_FORMAT_OPTIONS)}`,
    ];

    const graph = new ErrorPrevalenceOnWorkdaysBucketGraph(`${IMG_DIR}/workdays-errors-by-bucket.png`);
    await graph.draw(title, history);
    await graph.store();
}

const generateErrorLikelihoodOnWorkdaysBucketGraph = async (history: SessionHistory) => {
    if (history.getSize() < 2) throw new Error('Not enough data to plot graph.');

    const start = history.getEarliestSession()!.getStartTime();
    const end = history.getLatestSession()!.getEndTime();

    const title = [
        `Auftrittswahrscheinlichkeit aller während einer User-Session erlebten Bugs zwischen Montag und Freitag auf der Seite des Berliner LEAs`,
        `Bucket-Größe: ${history.getBucketSize().format()}`,
        `Start: ${formatDate(start, LONG_DATE_TIME_FORMAT_OPTIONS)}`,
        `Ende: ${formatDate(end, LONG_DATE_TIME_FORMAT_OPTIONS)}`,
    ];

    const graph = new ErrorLikelihoodOnWorkdaysBucketGraph(`${IMG_DIR}/error-likelihood-on-workdays-by-bucket.png`);
    await graph.draw(title, history);
    await graph.store();
}



const summarizeHistory = (history: SessionHistory) => {
    const successTimes = history
        .getSuccesses()
        .map(session => formatDateForFilename(session.getEndTime()));

    if (successTimes.length > 0) {
        logger.info(successTimes.sort().reverse(), `Time(s) at which an appointment was momentarily available:`);        
    }

    const errorCounts = history.getErrorCounts();
    logger.debug(errorCounts, `Errors experienced:`);
}



export const analyzeLogs = async (filepath: string) => {
    const logs = await parseLogs(filepath);
    
    const hourlyHistory = SessionHistoryBuilder.build(logs, ONE_HOUR);
    const biHourlyHistory = SessionHistoryBuilder.rebuildWithDifferentBucketSize(hourlyHistory, new TimeDuration(2, TimeUnit.Hours));

    await generateUserSessionLengthUntilFailureGraph(hourlyHistory);
    await generateUserSessionLengthUntilFailureBucketGraph(hourlyHistory);
    await generateErrorPrevalenceOnWorkdaysBucketGraph(biHourlyHistory);
    await generateErrorLikelihoodOnWorkdaysBucketGraph(biHourlyHistory);

    summarizeHistory(hourlyHistory);
}