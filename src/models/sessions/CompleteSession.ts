import { EXPECTED_ERRORS } from '../../config';
import { FIVE_MINUTES, LogMessages } from '../../constants';
import { BackToFindAppointmentPageError, NoAppointmentsError } from '../../errors';
import { Comparable, Log } from '../../types';
import TimeDuration, { TimeUnit } from '../TimeDuration';

interface Options {
    id: string,
    startTime: Date,
    endTime: Date,
    logs: Log[],
    errors: string[],
}



class CompleteSessionComparator {
    // This comparison function is used to sort sessions based on
    // their starting time
    public static compare(a: CompleteSession, b: CompleteSession) {
        if (a.getStartTime() < b.getStartTime()) return -1;
        if (a.getStartTime() > b.getStartTime()) return 1;
        return 0;
    }
}



class CompleteSession implements Comparable {
    protected id: string;
    protected startTime: Date;
    protected endTime: Date;
    protected logs: Log[];
    protected errors: string[];

    public constructor (args: Options) {
        const { id, startTime, endTime, logs, errors } = args;

        this.id = id;
        this.startTime = startTime;
        this.endTime = endTime;
        this.logs = logs;
        this.errors = errors;
    }

    public getId() {
        return this.id;
    }

    public getStartTime() {
        return this.startTime;
    }
    
    public getEndTime() {
        return this.endTime;
    }

    // The session was completed, no error was detected, and
    // the success message was logged: there seems to be an
    // appointment available!
    public foundAppointment() {
        return (
            this.errors.length === 0 &&
            this.logs.map(log => log.msg).includes(LogMessages.Success)
        );
    }

    public foundNoAppointment() {
        return (
            this.errors.length === 1 &&
            [NoAppointmentsError, BackToFindAppointmentPageError]
                .map(err => err.name)
                .includes(this.errors[0])
        );
    }

    public getLogs() {
        return this.logs;
    }

    public getErrors() {
        return this.logs
            .map(log => log.err)
            .filter(Boolean) as string[];
    }

    public hasUnexpectedErrors() {
        return this.getUnexpectedErrors().length > 0;
    }

    public getUnexpectedErrors() {
        return this.getErrors()
            .filter(err => !EXPECTED_ERRORS.map(e => e.name).includes(err));
    }

    public getDuration() {
        if (!this.startTime) throw new Error('Missing session start.');
        if (!this.endTime) throw new Error('Missing session end.');

        const startTime = this.startTime.getTime();
        const endTime = this.endTime.getTime();

        return new TimeDuration(endTime - startTime, TimeUnit.Milliseconds);
    }

    public isDurationReasonable = () => {
        return this.getDuration().smallerThan(FIVE_MINUTES);
    }

    // This comparison function is used to sort sessions based on
    // their starting time
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