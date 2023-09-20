import { IMG_DIR, LENGTHY_SESSION_DURATION } from './config';
import { LONG_DATE_TIME_FORMAT_OPTIONS } from './config/locale'
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

    const graph = new UserSessionLengthUntilFailureGraph(`${IMG_DIR}/user-session-duration.png`);
    await graph.draw(history);
    await graph.store();
}

const generateUserSessionLengthUntilFailureBucketGraph = async (history: SessionHistory) => {
    if (history.getSize() < 2) throw new Error('Not enough data to plot graph.');

    const graph = new UserSessionLengthUntilFailureBucketGraph(`${IMG_DIR}/user-session-duration-by-bucket.png`);
    await graph.draw(history);
    await graph.store();
}

const generateErrorPrevalenceOnWorkdaysBucketGraph = async (history: SessionHistory) => {
    if (history.getSize() < 2) throw new Error('Not enough data to plot graph.');

    const graph = new ErrorPrevalenceOnWorkdaysBucketGraph(`${IMG_DIR}/workdays-errors-by-bucket.png`);
    await graph.draw(history);
    await graph.store();
}

const generateErrorLikelihoodOnWorkdaysBucketGraph = async (history: SessionHistory) => {
    if (history.getSize() < 2) throw new Error('Not enough data to plot graph.');

    const graph = new ErrorLikelihoodOnWorkdaysBucketGraph(`${IMG_DIR}/error-likelihood-on-workdays-by-bucket.png`);
    await graph.draw(history);
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