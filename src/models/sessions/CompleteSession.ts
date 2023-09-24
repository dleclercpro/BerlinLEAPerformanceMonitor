import { LENGTHY_SESSION_DURATION } from '../../config';
import { Comparable, EventType, TimeUnit } from '../../types';
import { isKnownBug, isSessionFailureEvent } from '../../utils/event';
import Release from '../Release';
import TimeDuration from '../TimeDuration';
import Session, { SessionArgs } from './Session';

class CompleteSessionComparator {
    // This comparison function is used to sort sessions based on
    // their starting time
    public static compare(a: CompleteSession, b: CompleteSession) {
        if (a.getStartTime() < b.getStartTime()) return -1;
        if (a.getStartTime() > b.getStartTime()) return 1;
        return 0;
    }
}



interface CompleteSessionArgs extends SessionArgs {
    release?: Release,
}



class CompleteSession extends Session implements Comparable {
    protected release?: Release;

    public constructor({ release, ...args }: CompleteSessionArgs) {
        super(args);

        this.release = release;
    }

    public getId() {
        return this.id;
    }

    public getRelease() {
        return this.release;
    }

    public getStartTime() {
        return this.startTime!;
    }
    
    public getEndTime() {
        return this.endTime!;
    }

    public hasError() {
        return this.getError() !== undefined;
    }

    public getError() {
        const errors = this.getErrors();

        // There should only be one error!
        return errors.length > 0 ? errors[0] : undefined;
    }

    // The session was completed, no error was detected, and the success
    // message was logged: there seems to be an appointment available!
    public wasSuccess() {
        return this.events.findIndex(e => e.type === EventType.Success) !== -1;
    }

    // The session was not completed: there was a bug that
    // hindered the user's journey
    public wasBuggy() {
        const error = this.getError();
        
        return !!error && isKnownBug(error);
    }

    // The sessions was completed, but it can be understood
    // as a failure to find an appointment
    public wasFailure() {
        const error = this.getError();

        return !!error && isSessionFailureEvent(error);
    }

    public getDuration() {
        if (!this.startTime) throw new Error('Missing session start.');
        if (!this.endTime) throw new Error('Missing session end.');

        const startTime = this.startTime.getTime();
        const endTime = this.endTime.getTime();

        return new TimeDuration(endTime - startTime, TimeUnit.Milliseconds);
    }

    public isDurationReasonable = () => {
        return this.getDuration().smallerThan(LENGTHY_SESSION_DURATION);
    }

    public compare(other: CompleteSession) {
        return CompleteSessionComparator.compare(this, other);
    }

    public smallerThanOrEquals(other: CompleteSession) {
        return this.smallerThan(other) || this.equals(other);
    }

    public smallerThan(other: CompleteSession) {
        return this.compare(other) === -1;
    }

    public equals(other: CompleteSession) {
        return this.compare(other) === 0;
    }

    public greaterThan(other: CompleteSession) {
        return this.compare(other) === 1;
    }

    public greaterThanOrEquals(other: CompleteSession) {
        return this.greaterThan(other) || this.equals(other);
    }
}

export default CompleteSession;