import { WEEKDAYS } from '../../constants';
import { Weekday } from '../../types';
import logger from '../../logger';
import { getWeekday } from '../../utils/time';
import CompleteSession from './CompleteSession';

type Data = Record<Weekday, CompleteSession[]>;

class SessionHistory {
    protected sessions: Data;

    public constructor () {
        this.sessions = WEEKDAYS.reduce((prev, weekday) => {
            return {
                ...prev,
                [weekday]: [],
            };
        }, {} as Data);
    }

    public size() {
        return this.getSessions().length;
    }

    public addSession(session: CompleteSession) {
        const weekday = getWeekday(session.getStartTime());

        this.sessions[weekday].push(session);
    }

    public getSessionById(id: string) {
        return this.getSessions()
            .find(session => {
                return session.getId() === id;
            });
    }

    public getSessionsByWeekday(weekday: Weekday) {
        return this.sessions[weekday];
    }

    public getSessions() {
        return Object.values(this.sessions).reduce((prev, sessions) => {
            return [...prev, ...sessions];
        }, []);
    }
    
    public getEarliestSession() {
        const sessions = this.getSessions();
    
        if (sessions.length === 0) {
            return;
        }
    
        let earliestSession = sessions[0];
    
        sessions.forEach(session => {
            if (session.getStartTime() < earliestSession.getStartTime()) {
                earliestSession = session;
            }
        });
    
        return earliestSession;
    }

    public getLatestSession() {
        const sessions = this.getSessions();
    
        if (sessions.length === 0) {
            return;
        }
    
        let latestSession = sessions[0];
    
        sessions.forEach(session => {
            if (session.getStartTime() > latestSession.getStartTime()) {
                latestSession = session;
            }
        });
    
        return latestSession;
    }

    public getErrors() {
        return WEEKDAYS.reduce((errors, weekday) => {
            return [...errors, ...this.getErrorsByWeekday(weekday)];
        }, [] as string[]);
    }

    public getErrorsByWeekday(weekday: Weekday) {
        return this.getSessionsByWeekday(weekday)
            .filter(session => session.getErrors().length > 0)
            .reduce((errors, session) => {
                return [...errors, ...session.getErrors()];
            }, [] as string[]);
    }
}

export default SessionHistory;