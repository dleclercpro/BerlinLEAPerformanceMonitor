import { ONE_DAY, WEEKDAYS } from '../../constants';
import { Weekday } from '../../types';
import { getWeekday } from '../../utils/locale';
import { getRange } from '../../utils/math';
import { getTimeSpentSinceMidnight } from '../../utils/time';
import TimeDuration, { TimeUnit } from '../TimeDuration';
import CompleteSession from './CompleteSession';
import { SessionBucket } from './SessionHistoryBuilder';

type Data = Record<Weekday, SessionBucket[]>;

class SessionHistory {
    protected buckets: Data;
    protected bucketSize: TimeDuration;

    public constructor (buckets: Data, bucketSize: TimeDuration) {
        this.buckets = buckets;
        this.bucketSize = bucketSize;
    }

    public getSize() {
        return this.getSessions().length;
    }

    public getBucketSize() {
        return this.bucketSize;
    }

    public addSession(session: CompleteSession) {
        const weekday = getWeekday(session.getStartTime());
        const buckets = this.getBucketsByWeekday(weekday);

        // Look for bucket in which session belongs
        buckets.forEach(bucket => {
            const startTime = getTimeSpentSinceMidnight(session.getStartTime());
            const endTime = getTimeSpentSinceMidnight(session.getEndTime());

            if (bucket.startTime.smallerThanOrEquals(startTime) && endTime.smallerThan(bucket.endTime)) {

                // Sort on insert
                bucket.sessions = [...bucket.sessions, session].sort(CompleteSession.compare);
            }
        });
    }

    public getSessionById(id: string) {
        return this.getSessions()
            .find(session => {
                return session.getId() === id;
            });
    }

    public getBucketsByWeekday(weekday: Weekday) {
        return this.buckets[weekday];
    }

    public getSessionsByWeekday(weekday: Weekday) {
        return this.getBucketsByWeekday(weekday)
            .map(bucket => bucket.sessions)
            .reduce((prev, sessions) => {
                return [...prev, ...sessions];
            }, [] as CompleteSession[])
            .sort(CompleteSession.compare);
    }

    public getSessions() {
        return WEEKDAYS
            .reduce((prev, weekday) => {
                return [...prev, ...this.getSessionsByWeekday(weekday)];
            }, [] as CompleteSession[])
            .sort(CompleteSession.compare);
    }
    
    public getEarliestSession() {
        const sessions = this.getSessions();
    
        if (sessions.length > 0) {
            return sessions[0];
        }
    }

    public getLatestSession() {
        const sessions = this.getSessions();
    
        if (sessions.length > 0) {
            return sessions[sessions.length - 1];
        }
    }

    public getSuccesses() {
        return this.getSessions()
            .filter(session => session.foundAppointment());
    }

    public getErrors() {
        return WEEKDAYS.reduce((errors, weekday) => {
            return [...errors, ...this.getErrorsByWeekday(weekday)];
        }, [] as string[]);
    }

    public getErrorsByWeekday(weekday: Weekday) {
        return this.getSessionsByWeekday(weekday)
            .reduce((errors, session) => {
                return [...errors, ...session.getErrors()];
            }, [] as string[]);
    }
}

export default SessionHistory;