import { NEW_LINE_REGEXP } from './constants';
import logger from './logger';
import SessionLengthGraph from './models/graphs/SessionLengthGraph';
import { Log, TimeUnit } from './types';
import { readFile } from './utils/file';
import SessionHistoryBuilder from './models/sessions/SessionHistoryBuilder';
import { formatDateForFilename } from './utils/locale';
import SessionAverageLengthGraph from './models/graphs/SessionAverageLengthGraph';
import SessionHistory from './models/sessions/SessionHistory';
import EventPrevalenceOnWorkdaysGraph from './models/graphs/EventPrevalenceOnWorkdaysGraph';
import TimeDuration from './models/TimeDuration';
import { ONE_HOUR } from './constants/times';
import ErrorLikelihoodOnWorkdaysGraph from './models/graphs/ErrorLikelihoodOnWorkdaysGraph';



const parseLogs = async (filepath: string) => {
    logger.info(`Reading logs from: ${filepath}`);

    const file = await readFile(filepath);

    const logs: Log[] = file
        .split(NEW_LINE_REGEXP)
        .filter((textLog: string) => textLog.startsWith('{') && textLog.endsWith('}'))
        .map((textLog, i) => ({ line: i + 1, ...JSON.parse(textLog) }))
        .filter((log) => (!!log && !!log.msg)); // Every log should have a message

    logger.info(`Parsed ${logs.length} logs.`);

    return logs;
}



const generateSessionLengthGraph = async (history: SessionHistory) => {
    const graph = new SessionLengthGraph();
    await graph.draw(history);
    await graph.store();
}

const generateSessionAverageLengthGraph = async (history: SessionHistory) => {
    const IGNORE_DAYS_WITH_EMPTY_BUCKETS = false;

    const graph = new SessionAverageLengthGraph();
    await graph.draw(history, IGNORE_DAYS_WITH_EMPTY_BUCKETS);
    await graph.store();
}

const generateEventPrevalenceOnWorkdaysGraph = async (history: SessionHistory) => {
    const graph = new EventPrevalenceOnWorkdaysGraph();
    await graph.draw(history);
    await graph.store();
}

const generateErrorLikelihoodOnWorkdaysGraph = async (history: SessionHistory) => {
    const graph = new ErrorLikelihoodOnWorkdaysGraph();
    await graph.draw(history);
    await graph.store();
}



const summarizeHistory = (history: SessionHistory) => {
    const successTimes = history
        .getSuccesses()
        .map(session => formatDateForFilename(session.getEndTime()));

    if (successTimes.length > 0) {
        logger.info(`Time(s) at which an appointment was momentarily available:`);
        successTimes.sort().reverse().forEach(time => {
            logger.info(time);
        });
    }

    const errorCounts = history.getErrorCounts();
    logger.debug(errorCounts, `Errors experienced:`);
}



export const analyzeLogs = async (filepath: string) => {
    const logs = await parseLogs(filepath);
    
    const hourlyHistory = SessionHistoryBuilder.build(logs, ONE_HOUR);
    const biHourlyHistory = SessionHistoryBuilder.rebuildWithDifferentBucketSize(hourlyHistory, new TimeDuration(2, TimeUnit.Hours));

    await generateSessionLengthGraph(hourlyHistory);
    await generateSessionAverageLengthGraph(hourlyHistory);
    await generateEventPrevalenceOnWorkdaysGraph(biHourlyHistory);
    await generateErrorLikelihoodOnWorkdaysGraph(biHourlyHistory);

    summarizeHistory(hourlyHistory);
}