import { WEEKDAYS, WORKDAYS } from '../../constants/times';
import logger from '../../logger';
import { Weekday } from '../../types';
import { unique } from '../../utils/array';
import { getWeekday } from '../../utils/locale';
import TimeDuration from '../TimeDuration';
import SessionBucket from '../buckets/SessionBucket';
import CompleteSession from './CompleteSession';

type Buckets = Record<Weekday, SessionBucket[]>;

class SessionHistory {
    protected buckets: Buckets;
    protected bucketSize: TimeDuration;

    public constructor (buckets: Buckets, bucketSize: TimeDuration) {
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

        // Look for bucket in which session belongs (only based
        // on time when it started)
        buckets.forEach(bucket => {
            if (bucket.contains(session)) {
                logger.trace(`Adding session to bucket: ${bucket.format()}`);
                bucket.add(session);
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

    public getBucketsForEachWorkday(): SessionBucket[] {
        return WORKDAYS.reduce((buckets: SessionBucket[], workday) => {
            const workdayBuckets = this.buckets[workday];

            return workdayBuckets.map((workdayBucket: SessionBucket, i) => {
                const mergedBucket = new SessionBucket(workdayBucket.getStartTime(), workdayBucket.getEndTime());

                if (buckets.length > 0) {
                    buckets[i].getSessions().forEach(session => mergedBucket.add(session));
                }
                workdayBucket.getSessions().forEach(session => mergedBucket.add(session));

                return mergedBucket;
            });

        }, []);
    }

    public getSessionsByWeekday(weekday: Weekday): CompleteSession[] {
        return this.getBucketsByWeekday(weekday)
            .map(bucket => bucket.getSessions())
            .reduce((prev, sessions) => {
                return [...prev, ...sessions];
            }, [] as CompleteSession[])
            .sort((a, b) => a.compare(b));
    }

    public getSessions(): CompleteSession[] {
        return WEEKDAYS
            .reduce((prev, weekday) => {
                return [...prev, ...this.getSessionsByWeekday(weekday)];
            }, [] as CompleteSession[])
            .sort((a, b) => a.compare(b));
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

    public getUniqueErrors() {
        return unique(this.getErrors());
    }

    public getErrorsByWeekday(weekday: Weekday) {
        return this.getSessionsByWeekday(weekday)
            .reduce((errors, session) => {
                return [...errors, ...session.getErrors()];
            }, [] as string[]);
    }
}

export default SessionHistory;