import { getLast } from '../../utils/array';
import Session from './Session';

class SessionHistory {
    protected sessions: Session[];

    public constructor () {
        this.sessions = [];
    }

    public size() {
        return this.sessions.length;
    }

    public getSessions() {
        return this.sessions;
    }

    public getSessionById(id: string) {
        return this.sessions.find(session => {
            return session.getId() === id;
        });
    }

    public getMostRecentSession() {
        return getLast(this.sessions);
    }

    public getErrors() {
        return this.sessions
            .filter((session: Session) => session.getErrors().length > 0)
            .map((session: Session) => session.getErrors().join('|'));
    }

    public has(id: string) {
        return this.sessions.findIndex(session => {
            return session.getId() === id;
        }) !== -1;
    }

    public push(session: Session) {
        this.sessions.push(session);
    }

    public pop() {
        return this.sessions.pop();
    }
}

export default SessionHistory;