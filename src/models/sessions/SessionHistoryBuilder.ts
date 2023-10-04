import logger from '../../logger';
import { Log, TimeUnit, Weekday } from '../../types';
import IncompleteSession from './IncompleteSession';
import SessionHistory from './SessionHistory';
import CompleteSession from './CompleteSession';
import { ONE_DAY, ONE_HOUR, WEEKDAYS } from '../../constants/times';
import TimeDuration from '../TimeDuration';
import { getRange } from '../../utils/math';
import SessionBucket from '../buckets/SessionBucket';
import Release from '../Release';
import { RELEASE_ZERO } from '../../constants';
import { MINIMUM_RELEASE } from '../../config';

const TEXTS = {
    SessionStart: '[START]',
    SessionEnd: '[END]',
};

class SessionHistoryBuilder {
    private static instance: SessionHistoryBuilder;
    
    private minimumRelease: Release = MINIMUM_RELEASE;

    private constructor () {

    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new SessionHistoryBuilder();
        }

        return this.instance;
    }

    public build(logs: Log[], bucketSize: TimeDuration = ONE_HOUR) {
        logger.info(`Building daily session history from ${logs.length} log entries...`);

        const history = new SessionHistory(this.buildBuckets(bucketSize), bucketSize);

        let session: IncompleteSession = IncompleteSession.create();
        let release: Release = RELEASE_ZERO;

        // Read logs in chronological order
        logs.forEach(log => {

            // Parse app version
            const [major, minor, patch] = log.version.split('.').map(Number);
            release = new Release(major, minor, patch);

            // Should builder ignore log?
            if (release.smallerThan(this.minimumRelease)) {
                return;
            }

            // Session started
            if (log.msg.includes(TEXTS.SessionStart)) {
                session = IncompleteSession.create();

                logger.trace(`Starting session: ${session.getId()} [${release.toString()}]`);
                session.start(new Date(log.time));
            }

            // Session exists and is open: store log
            if (session.isOpen()) {
                session.push(log);
            }

            // Session ended
            if (log.msg.includes(TEXTS.SessionEnd)) {
                logger.trace(`Finishing session: ${session.getId()}`);
                session.end(new Date(log.time));

                // Sessions should have a start and an end
                if (!session.isComplete()) {
                    return;
                }

                // Has session more than one error: it is invalid!
                const errorCount = session.getErrors().length;
                if (errorCount > 1) {
                    const sessionStartLine = session.getLogs()[0].line;
                    logger.warn(`Invalid session [@${sessionStartLine}] with ${errorCount} errors found (there should only be one)`);
                    return;
                }

                // Store complete session in history
                history.addSession(new CompleteSession({
                    id: session.getId(),
                    release,
                    startTime: session.getStartTime()!,
                    endTime: session.getEndTime()!,
                    logs: session.getLogs(),
                    error: errorCount === 1 ? session.getErrors()[0] : undefined,
                }));
            }
        });

        logger.info(`Found ${history.getSize()} complete sessions.`);

        return history;
    }

    public rebuildWithDifferentBucketSize(prevHistory: SessionHistory, bucketSize: TimeDuration) {
        logger.info(
            `Re-building daily session history with a different bucket size: ` +
            `${prevHistory.getBucketSize().format()} -> ${bucketSize.format()}`
        );
        
        if (prevHistory.getBucketSize() === bucketSize) {
            logger.warn(`Trying to rebuild session history with same bucket size.`);
            return prevHistory;
        }

        const history = new SessionHistory(this.buildBuckets(bucketSize), bucketSize);

        prevHistory.getSessions().forEach(session => {
            history.addSession(session);
        });

        return history;
    }

    protected buildBuckets(size: TimeDuration) {
        const count = ONE_DAY.toMs().getAmount() / size.toMs().getAmount();

        logger.debug(`Bucket size: ${size.format()}`);
        logger.debug(`Bucket count: ${count}`);

        return WEEKDAYS.reduce((prev, weekday) => {
            return {
                ...prev,
                [weekday]: getRange(count).map(i => new SessionBucket(
                    new TimeDuration(i * size.toMs().getAmount(), TimeUnit.Milliseconds),
                    new TimeDuration((i + 1) * size.toMs().getAmount(), TimeUnit.Milliseconds),
                )),
            };
        }, {} as Record<Weekday, SessionBucket[]>);
    }
}

export default SessionHistoryBuilder.getInstance();