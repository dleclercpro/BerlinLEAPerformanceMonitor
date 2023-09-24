import { WEEKDAYS, WORKDAYS } from '../../constants/times';
import logger from '../../logger';
import { Event, VersionedData, Weekday } from '../../types';
import { toCountsFromArray, unique } from '../../utils/array';
import { getWeekday } from '../../utils/locale';
import TimeDuration from '../TimeDuration';
import SessionBucket from '../buckets/SessionBucket';
import CompleteSession from './CompleteSession';

export type SessionBucketsDict = Record<Weekday, SessionBucket[]>;
export type SessionFilter = (session: CompleteSession) => boolean;
export type EventFilter = (event: Event) => boolean;

class SessionHistory {
    protected version: number;
    protected bucketsDict: SessionBucketsDict;
    protected bucketSize: TimeDuration;
    protected mergedWorkdayBuckets: VersionedData<SessionBucket[]>;

    public constructor (bucketsDict: SessionBucketsDict, bucketSize: TimeDuration) {
        this.version = 0;
        this.bucketsDict = bucketsDict;
        this.bucketSize = bucketSize;
        this.mergedWorkdayBuckets = { version: 0, data: [] };
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
        const weekdayBuckets = this.bucketsDict[weekday];
        logger.debug(weekdayBuckets, 'weekdayBuckets');
        return weekdayBuckets;
    }

    public getMergedWorkdayBuckets(): SessionBucket[] {
        const mustRecompute = this.version > this.mergedWorkdayBuckets.version;

        // Optimize computation of merged session buckets: only recompute when necessary
        if (mustRecompute) {
            logger.debug(`Re-computing merged buckets on workday basis...`);

            this.mergedWorkdayBuckets.data = WORKDAYS.reduce((mergedBuckets: SessionBucket[], workday: Weekday) => {
                const buckets = this.bucketsDict[workday];

                return buckets.map((bucket: SessionBucket, bucketIndex: number) => {
                    const mergedBucket = new SessionBucket(bucket.getStartTime(), bucket.getEndTime());

                    // Buckets from at least one previous day have already been merged: restore their content
                    if (mergedBuckets.length > 0) {
                        mergedBuckets[bucketIndex].getSessions().forEach(session => mergedBucket.add(session));
                    }

                    // Add current workday's sessions to merged bucket
                    bucket.getSessions().forEach(session => mergedBucket.add(session));

                    return mergedBucket;
                });

            }, []);

            // Update version of object to current version of whole session history
            this.mergedWorkdayBuckets.version = this.version;
        }
        
        return this.mergedWorkdayBuckets.data;
    }

    public getSessionsByWeekday(weekday: Weekday, sessionFilter: SessionFilter = () => true): CompleteSession[] {
        return this.getBucketsByWeekday(weekday)
            .map(bucket => bucket.getSessions())
            .reduce((prev, sessions) => [...prev, ...sessions], [] as CompleteSession[])
            .filter(sessionFilter)
            .sort((a, b) => a.compare(b));
    }

    public getSessions(sessionFilter: SessionFilter = () => true): CompleteSession[] {
        return WEEKDAYS
            .reduce((prev, weekday) => [...prev, ...this.getSessionsByWeekday(weekday)], [] as CompleteSession[])
            .filter(sessionFilter)
            .sort((a, b) => a.compare(b));
    }

    public getWorkdaySessions(sessionFilter: SessionFilter = () => true): CompleteSession[] {
        return WORKDAYS
            .reduce((prev, weekday) => [...prev, ...this.getSessionsByWeekday(weekday)], [] as CompleteSession[])
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
    
        if (sessions.length > 0) {
            return sessions[sessions.length - 1];
        }
    }

    public getEvents(eventFilter: EventFilter = () => true) {
        return this.getSessions()
            .reduce((prevEvents, session) => [...prevEvents, ...session.getEvents()], [] as Event[])
            .filter(eventFilter);
    }

    public getSuccesses() {
        return this.getSessions(session => session.wasSuccess());
    }

    public getErrors(errorFilter: EventFilter = () => true) {
        return WEEKDAYS
            .reduce((errors, weekday) => [...errors, ...this.getErrorsByWeekday(weekday)], [] as Event[])
            .filter(errorFilter);
    }

    public getErrorsByWeekday(weekday: Weekday, errorFilter: EventFilter = () => true) {
        const errors = this.getSessionsByWeekday(weekday)
            .map(session => session.getError())
            .filter(Boolean) as Event[];

        logger.debug(`# errors: ${errors.length}`);

        return errors.filter(errorFilter);
    }

    public getUniqueErrors(errorFilter: EventFilter = () => true) {
        const errors = this.getErrors(errorFilter)
            .map(error => error.id);

        return unique(errors);
    }

    public getErrorCounts() {
        const errors = this.getErrors()
            .map(event => event.id);

        return toCountsFromArray(errors);
    }
}

export default SessionHistory;