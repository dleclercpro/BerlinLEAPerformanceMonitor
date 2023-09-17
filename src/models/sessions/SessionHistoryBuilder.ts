import logger from '../../utils/logging';
import { Log } from '../../types';
import Session from './Session';
import SessionHistory from './SessionHistory';

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

        // Initial session
        let session = Session.create();

        // Read logs in chronological order
        logs.forEach(log => {

            // Session started
            if (log.msg.includes(TEXTS.SessionStart)) {

                // Reset session
                if (!session.isNew()) {
                    logger.trace(`Resetting session: ${session.getId()}`);
                    session = Session.create();
                }

                logger.trace(`Starting session: ${session.getId()}`);
                session.setStart(new Date(log.time));
            }

            // Session open: store log
            if (session.isOpen()) {
                logger.trace(`Adding log to session: ${log.msg}`);
                session.pushLog(log);
            }

            // Session ended
            if (log.msg.includes(TEXTS.SessionEnd)) {
                logger.trace(`Finishing session: ${session.getId()}`);
                session.setEnd(new Date(log.time));

                // Store session in history
                history.push(session);
            }
        });

        logger.info(`Found ${history.size()} complete sessions.`);

        return history;
    }
}

export default SessionHistoryBuilder.getInstance();