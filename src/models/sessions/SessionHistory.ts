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

    public get() {
        return this.sessions;
    }

    public getById(id: string) {
        return this.sessions.find(session => {
            return session.getId() === id;
        });
    }

    public getMostRecent() {
        return getLast(this.sessions);
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