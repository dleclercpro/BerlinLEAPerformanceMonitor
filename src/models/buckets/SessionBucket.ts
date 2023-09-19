import { ErrorDict } from '../../types';
import { getCountsDict } from '../../utils/math';
import { getTimeSpentSinceMidnight } from '../../utils/time';
import TimeDuration from '../TimeDuration';
import CompleteSession from '../sessions/CompleteSession';
import Bucket from './Bucket';

const generateEmptyErrorDict = (errors: string[], errorFilter: (err: string) => boolean) => {
    return errors
        .filter(errorFilter)
        .reduce((prevErrors, error) => {
            return {
                ...prevErrors,
                [error]: 0,
            };
        }, {});
}

class SessionBucket extends Bucket<TimeDuration, CompleteSession> {

    public getStartTime() {
        return this.start;
    }

    public getEndTime() {
        return this.end;
    }

    public getSessions() {
        return this.data;
    }

    public getErrorDict(errorFilter: (error: string) => boolean = () => true): ErrorDict {
        const errors = this
            .getSessions()
            .reduce((prevErrors: string[], session: CompleteSession) => {
                return [...prevErrors, ...session.getErrors()];
            }, [])
            .filter(errorFilter);

        return {
            ...generateEmptyErrorDict(errors, errorFilter),
            ...getCountsDict(errors),
        };
    }

    public format() {
        return `[${this.start.format()}-${this.end.format()}]`;
    }

    public contains(session: CompleteSession) {
        const sinceMidnight = getTimeSpentSinceMidnight(session.getStartTime());

        return this.start.smallerThanOrEquals(sinceMidnight) && sinceMidnight.smallerThan(this.end);
    }
}

export default SessionBucket;