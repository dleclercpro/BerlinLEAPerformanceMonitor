import { WEEKDAYS, WORKDAYS } from '../../constants/times';
import logger from '../../logger';
import { VersionedData, Weekday } from '../../types';
import { toCountsFromArray, unique } from '../../utils/array';
import { getWeekday } from '../../utils/locale';
import TimeDuration from '../TimeDuration';
import SessionBucket from '../buckets/SessionBucket';
import CompleteSession from './CompleteSession';

export type SessionBuckets = Record<Weekday, SessionBucket[]>;
export type SessionFilter = (session: CompleteSession) => boolean;
export type ErrorFilter = (error: string) => boolean;

class SessionHistory {
    protected version: number;
    protected buckets: SessionBuckets;
    protected bucketSize: TimeDuration;
    protected mergedBucketsOnWorkdayBasis: VersionedData<SessionBucket[]>;

    public constructor (buckets: SessionBuckets, bucketSize: TimeDuration) {
        this.version = 0;
        this.buckets = buckets;
        this.bucketSize = bucketSize;
        this.mergedBucketsOnWorkdayBasis = { version: 0, data: [] };
    }

    public getVersion() {
        return this.version;
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

        // Increment version of history
        this.version += 1;
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

    public getMergedBucketsOnWorkdayBasis(): SessionBucket[] {

        // Optimize computation of merged session buckets: only recompute when necessary
        const mustRecompute = this.version > this.mergedBucketsOnWorkdayBasis.version;

        if (mustRecompute) {
            logger.debug(`Re-computing merged buckets on workday basis...`);

            this.mergedBucketsOnWorkdayBasis.data = WORKDAYS.reduce((buckets: SessionBucket[], workday) => {
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

            // Update version of object to current version of whole session history
            this.mergedBucketsOnWorkdayBasis.version = this.version;
        }
        
        return this.mergedBucketsOnWorkdayBasis.data;
    }

    public getSessionsByWeekday(weekday: Weekday, sessionFilter: SessionFilter = () => true): CompleteSession[] {
        return this.getBucketsByWeekday(weekday)
            .map(bucket => bucket.getSessions())
            .reduce((prev, sessions) => {
                return [...prev, ...sessions];
            }, [] as CompleteSession[])
            .filter(sessionFilter)
            .sort((a, b) => a.compare(b));
    }

    public getSessions(sessionFilter: SessionFilter = () => true): CompleteSession[] {
        return WEEKDAYS
            .reduce((prev, weekday) => {
                return [...prev, ...this.getSessionsByWeekday(weekday)];
            }, [] as CompleteSession[])
            .filter(sessionFilter)
            .sort((a, b) => a.compare(b));
    }

    public getWorkdaySessions(sessionFilter: SessionFilter = () => true): CompleteSession[] {
        return WORKDAYS
            .reduce((prev, weekday) => {
                return [...prev, ...this.getSessionsByWeekday(weekday)];
            }, [] as CompleteSession[])
            .filter(sessionFilter)
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
        return this.getSessions(session => session.foundAppointment());
    }

    public getErrors(errorFilter: ErrorFilter = () => true) {
        return WEEKDAYS.reduce((errors, weekday) => {
            return [...errors, ...this.getErrorsByWeekday(weekday)];
        }, [] as string[])
        .filter(errorFilter);
    }

    public getUniqueErrors(errorFilter: ErrorFilter = () => true) {
        return unique(this.getErrors(errorFilter));
    }

    public getErrorsByWeekday(weekday: Weekday, errorFilter: ErrorFilter = () => true) {
        return this.getSessionsByWeekday(weekday)
            .reduce((errors, session) => {
                return [...errors, ...session.getErrors()];
            }, [] as string[])
            .filter(errorFilter);
    }

    public getErrorCounts() {
        return toCountsFromArray(this.getErrors());
    }
}

export default SessionHistory;