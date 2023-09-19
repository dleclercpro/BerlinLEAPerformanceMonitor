import { getTimeSpentSinceMidnight } from '../../utils/time';
import TimeDuration from '../TimeDuration';
import CompleteSession from '../sessions/CompleteSession';
import Bucket from './Bucket';

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

    public format() {
        return `[${this.start.format()}-${this.end.format()}]`;
    }

    public contains(session: CompleteSession) {
        const sinceMidnight = getTimeSpentSinceMidnight(session.getStartTime());

        return this.start.smallerThanOrEquals(sinceMidnight) && sinceMidnight.smallerThan(this.end);
    }
}

export default SessionBucket;