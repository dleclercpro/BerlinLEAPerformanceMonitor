import { getLast } from '../../utils/array';
import CompleteSession from './CompleteSession';

class SessionHistory {
    protected sessions: CompleteSession[];

    public constructor () {
        this.sessions = [];
    }

    public size() {
        return this.sessions.length;
    }

    public getSessions() {
        return this.sessions;
    }

    public getSessionsByWeekday() {
        return this.getSessions()
            .reduce((sessions: Record<string, CompleteSession[]>, session: CompleteSession) => {
                const weekday = session.getStartTime().getDay();

                return {
                    ...sessions,
                    [weekday]: [ ...sessions[weekday], session ],
                };
            }, {});
    }

    public getSessionById(id: string) {
        return this.sessions.find(session => {
            return session.getId() === id;
        });
    }

    public getMostRecentSession() {
        return getLast(this.sessions);
    }

    public getErrorsAsString() {
        return this.sessions
            .filter(session => session.getErrors().length > 0)
            .filter(session => !session.hasUnexpectedErrors())
            .map(session => session.getErrors().join('|'));
    }

    public pushSession(session: CompleteSession) {
        this.sessions.push(session);
    }

    public popSession() {
        return this.sessions.pop();
    }
}

export default SessionHistory;