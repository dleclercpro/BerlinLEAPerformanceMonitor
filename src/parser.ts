import { GRAPH_PATH } from './config';
import { NEW_LINE_REGEXP } from './constants';
import logger from './logger';
import Session from './models/sessions/Session';
import PerformanceGraph from './models/graphs/PerformanceGraph';
import { Log } from './types';
import { readFile } from './utils/file';
import { getCountsDict } from './utils/math';
import TimeDuration, { TimeUnit } from './models/TimeDuration';
import SessionHistoryBuilder from './models/sessions/SessionHistoryBuilder';

export const parseLogs = async (filepath: string) => {
    const file = await readFile(filepath);

    const logs = file
        .split(NEW_LINE_REGEXP)
        .filter(Boolean)
        .map(line => JSON.parse(line) as Log);

    const history = SessionHistoryBuilder.build(logs);
    const sessions = history.getSessions();

    const reasonableSessions = sessions
        .filter(session => {
            return session.getDuration().smallerThan(new TimeDuration(1, TimeUnit.Hours));
        });

    const errors = history.getErrors();
    logger.debug(getCountsDict(errors), `Errors:`);

    const results = reasonableSessions.map((session: Session) => {
        return {
            start: session.getStart()!,
            duration: session.getDuration()!,
        };
    });

    const graph = new PerformanceGraph(GRAPH_PATH);
    await graph.draw(results);
}