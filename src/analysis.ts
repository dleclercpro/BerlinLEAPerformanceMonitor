import { IMG_DIR, LONG_DATE_TIME_FORMAT_OPTIONS } from './config';
import { NEW_LINE_REGEXP } from './constants';
import logger from './logger';
import NoAppointmentsGraph from './models/graphs/NoAppointmentsGraph';
import { Log, TimeUnit } from './types';
import { readFile } from './utils/file';
import { getCountsDict, sum } from './utils/math';
import SessionHistoryBuilder from './models/sessions/SessionHistoryBuilder';
import { formatDate, formatDateForFilename } from './utils/locale';
import NoAppointmentsGraphByBucket from './models/graphs/NoAppointmentsGraphByBucket';
import SessionHistory from './models/sessions/SessionHistory';
import WorkdaysErrorGraphByBucket, { isErrorKnown } from './models/graphs/WorkdaysErrorGraphByBucket';
import TimeDuration from './models/TimeDuration';
import { ONE_HOUR } from './constants/times';



const parseLogs = async (filepath: string) => {
    const file = await readFile(filepath);

    return file
        .split(NEW_LINE_REGEXP)
        .filter(Boolean)
        .map(line => JSON.parse(line) as Log);
}



const generateNoAppointmentsGraph = async (history: SessionHistory) => {
    if (history.getSize() < 2) throw new Error('Not enough data to plot graph.');
        
    const start = history.getEarliestSession()!.getStartTime();
    const end = history.getLatestSession()!.getEndTime();

    const title = [
        `Länge einer User-Session auf der Seite des Berliner LEAs, bis zur Fehlermeldung 'Es sind keine Termine frei.'`,
        `Start: ${formatDate(start, LONG_DATE_TIME_FORMAT_OPTIONS)}`,
        `End: ${formatDate(end, LONG_DATE_TIME_FORMAT_OPTIONS)}`,
    ];

    const graph = new NoAppointmentsGraph(`${IMG_DIR}/user-session-duration.png`);
    await graph.draw(title, history);
    await graph.store();
}

const generateNoAppointmentsByBucketGraph = async (history: SessionHistory) => {
    if (history.getSize() < 2) throw new Error('Not enough data to plot graph.');
        
    const start = history.getEarliestSession()!.getStartTime();
    const end = history.getLatestSession()!.getEndTime();

    const title = [
        `Durchnittliche Länge einer User-Session auf der Seite des Berliner LEAs, bis zur Fehlermeldung 'Es sind keine Termine frei.'`,
        `Bucket-Größe: ${history.getBucketSize().format()}`,
        `Start: ${formatDate(start, LONG_DATE_TIME_FORMAT_OPTIONS)}`,
        `End: ${formatDate(end, LONG_DATE_TIME_FORMAT_OPTIONS)}`,
    ];

    const graph = new NoAppointmentsGraphByBucket(`${IMG_DIR}/user-session-duration-by-bucket.png`);
    await graph.draw(title, history);
    await graph.store();
}

const generateWeekdaysErrorGraph = async (history: SessionHistory) => {
    if (history.getSize() < 2) throw new Error('Not enough data to plot graph.');
        
    const start = history.getEarliestSession()!.getStartTime();
    const end = history.getLatestSession()!.getEndTime();

    const totalErrorCount = history.getErrors().filter(isErrorKnown).length;

    const title = [
        `Prävalenz aller während einer User-Session erlebten Bugs auf der Seite des Berliner LEAs`,
        `Gesamtanzahl der gemessenen Bugs: ${totalErrorCount}`,
        `Bucket-Größe: ${history.getBucketSize().format()}`,
        `Start: ${formatDate(start, LONG_DATE_TIME_FORMAT_OPTIONS)}`,
        `End: ${formatDate(end, LONG_DATE_TIME_FORMAT_OPTIONS)}`,
    ];

    const graph = new WorkdaysErrorGraphByBucket(`${IMG_DIR}/workdays-errors-by-bucket.png`);
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

    const errorDict = getCountsDict(history.getErrors());
    logger.debug(errorDict, `Errors experienced:`);
}



export const analyzeLogs = async (filepath: string) => {
    const logs = await parseLogs(filepath);
    
    const hourlyHistory = SessionHistoryBuilder.build(logs, ONE_HOUR);
    const biHourlyHistory = SessionHistoryBuilder.build(logs, new TimeDuration(2, TimeUnit.Hours));

    await generateNoAppointmentsGraph(hourlyHistory);
    await generateNoAppointmentsByBucketGraph(hourlyHistory);
    await generateWeekdaysErrorGraph(biHourlyHistory);

    // summarizeHistory(history);
}