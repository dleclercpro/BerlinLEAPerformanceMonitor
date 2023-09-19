import logger from '../../logger';
import { Log, TimeUnit, Weekday } from '../../types';
import Session from './Session';
import SessionHistory from './SessionHistory';
import CompleteSession from './CompleteSession';
import { ONE_DAY, WEEKDAYS } from '../../constants';
import TimeDuration from '../TimeDuration';
import { getRange } from '../../utils/math';
import { BUCKET_SIZE } from '../../config';
import SessionBucket from '../buckets/SessionBucket';

const TEXTS = {
    SessionStart: '[START]',
    SessionEnd: '[END]',
};

class SessionHistoryBuilder {
    private static instance: SessionHistoryBuilder;

    private constructor () {

    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new SessionHistoryBuilder();
        }

        return this.instance;
    }

    public build(logs: Log[]) {
        logger.debug(`Building daily session history from ${logs.length} log entries...`);

        const history = new SessionHistory(this.buildBuckets(BUCKET_SIZE), BUCKET_SIZE);

        let session: Session;

        // Read logs in chronological order
        logs.forEach(log => {

            // Session started
            if (log.msg.includes(TEXTS.SessionStart)) {
                session = Session.create();

                logger.trace(`Starting session: ${session.getId()}`);
                session.start(new Date(log.time));
            }

            // Session open: store log
            if (session.isOpen()) {
                logger.trace(`Adding log to session: ${log.msg}`);
                session.pushLog(log);
            }

            // Session ended
            if (log.msg.includes(TEXTS.SessionEnd)) {
                logger.trace(`Finishing session: ${session.getId()}`);
                session.end(new Date(log.time));

                // Store complete session in history
                history.addSession(new CompleteSession({
                    id: session.getId(),
                    startTime: session.getStartTime()!,
                    endTime: session.getEndTime()!,
                    logs: session.getLogs(),
                    errors: session.getErrors(),
                }));
            }
        });

        logger.info(`Found ${history.getSize()} complete sessions.`);

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