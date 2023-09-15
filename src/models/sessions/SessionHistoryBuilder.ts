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

    public build(logs: Log[]) {
        const history = new SessionHistory();

        // Initial session
        let session = Session.create();

        // Read logs in chronological order
        logs.forEach(log => {

            // Session started
            if (log.msg.includes(TEXTS.SessionStart)) {

                // Reset session
                if (!session.isNew()) {
                    session = Session.create();
                }

                session.setStart(new Date(log.time));
            }

            // Session open: store log
            if (session.isOpen()) {
                session.pushLog(log);
            }

            // Session ended
            if (log.msg.includes(TEXTS.SessionEnd)) {
                session.setEnd(new Date(log.time));

                // Store session in history
                history.push(session);
            }
        });

        return history;
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new SessionHistoryBuilder();
        }

        return this.instance;
    }
}

export default SessionHistoryBuilder.getInstance();