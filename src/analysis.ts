import { NEW_LINE_REGEXP } from './constants';
import logger from './logger';
import UserSessionLengthUntilFailureGraph from './models/graphs/UserSessionLengthUntilFailureGraph';
import { Log, TimeUnit } from './types';
import { readFile } from './utils/file';
import SessionHistoryBuilder from './models/sessions/SessionHistoryBuilder';
import { formatDateForFilename } from './utils/locale';
import UserSessionLengthUntilFailureByBucketGraph from './models/graphs/UserSessionLengthUntilFailureByBucketGraph';
import SessionHistory from './models/sessions/SessionHistory';
import ErrorPrevalenceOnWorkdaysByBucketGraph from './models/graphs/ErrorPrevalenceOnWorkdaysByBucketGraph';
import TimeDuration from './models/TimeDuration';
import { ONE_HOUR } from './constants/times';
import ErrorLikelihoodOnWorkdaysByBucketGraph from './models/graphs/ErrorLikelihoodOnWorkdaysByBucketGraph';



const parseLogs = async (filepath: string) => {
    logger.info(`Reading logs from: ${filepath}`);

    const file = await readFile(filepath);

    const logs = file
        .split(NEW_LINE_REGEXP)
        .filter(Boolean)
        .map(line => JSON.parse(line) as Log)
        .filter(log => (log.msg !== undefined)); // Something is wrong with this log: there should always be a message!

    logger.info(`Parsed ${logs.length} logs.`);

    return logs;
}



const generateUserSessionLengthUntilFailureGraph = async (history: SessionHistory) => {
    const graph = new UserSessionLengthUntilFailureGraph();
    await graph.draw(history);
    await graph.store();
}

const generateUserSessionLengthUntilFailureBucketGraph = async (history: SessionHistory) => {
    const graph = new UserSessionLengthUntilFailureByBucketGraph();
    await graph.draw(history);
    await graph.store();
}

const generateErrorPrevalenceOnWorkdaysBucketGraph = async (history: SessionHistory) => {
    const graph = new ErrorPrevalenceOnWorkdaysByBucketGraph();
    await graph.draw(history);
    await graph.store();
}

const generateErrorLikelihoodOnWorkdaysBucketGraph = async (history: SessionHistory) => {
    const graph = new ErrorLikelihoodOnWorkdaysByBucketGraph();
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