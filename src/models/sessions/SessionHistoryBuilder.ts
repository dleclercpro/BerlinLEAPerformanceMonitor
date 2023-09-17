import logger from '../../logger';
import { Log } from '../../types';
import Session from './Session';
import SessionHistory from './SessionHistory';
import CompleteSession from './CompleteSession';

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
        logger.debug(`Building session history from ${logs.length} log entries...`);

        const history = new SessionHistory();

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

        logger.info(`Found ${history.size()} complete sessions.`);

        return history;
    }
}

export default SessionHistoryBuilder.getInstance();