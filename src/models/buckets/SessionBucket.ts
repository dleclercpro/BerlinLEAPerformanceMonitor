import { CountsDict, Event } from '../../types';
import { toCountsFromArray } from '../../utils/array';
import { getTimeSpentSinceMidnight } from '../../utils/time';
import TimeDuration from '../TimeDuration';
import CompleteSession from '../sessions/CompleteSession';
import { SessionFilter } from '../sessions/SessionHistory';
import Bucket from './Bucket';

class SessionBucket extends Bucket<TimeDuration, CompleteSession> {

    public getStartTime() {
        return this.start;
    }

    public getEndTime() {
        return this.end;
    }

    public getSessions(sessionFilter: SessionFilter = () => true) {
        return this.data.filter(sessionFilter);
    }

    public getSessionErrors() {
        return this.getSessions()
            .map(session => session.getError())
            .filter(Boolean) as Event[];
    }

    public getErrorCounts(errorFilter: (event: Event) => boolean = () => true): CountsDict {
        const errors = this.getSessionErrors()
            .filter(errorFilter)
            .map(event => event.id);

        return toCountsFromArray(errors);
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