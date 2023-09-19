export enum Environment {
    Development = 'development',
    Test = 'test',
    Production = 'production',
}

export enum Locale {
    EN = 'en',
    DE = 'de-DE',
}

export enum Weekday {
    Sunday = 'Sunday',
    Monday = 'Monday',
    Tuesday = 'Tuesday',
    Wednesday = 'Wednesday',
    Thursday = 'Thursday',
    Friday = 'Friday',
    Saturday = 'Saturday',
}

export enum TimeUnit {
    Days = 'd',
    Hours = 'h',
    Minutes = 'm',
    Seconds = 's',
    Milliseconds = 'ms',
}

export interface VersionedContent <T> {
    version: number,
    content: T,
}

export interface Comparable {
    compare(other: Comparable): -1 | 0 | 1;
    smallerThan(other: Comparable): boolean;
    smallerThanOrEquals(other: Comparable): boolean;
    equals(other: Comparable): boolean;
    greaterThanOrEquals(other: Comparable): boolean;
    greaterThan(other: Comparable): boolean;
}

export type Log = {
    time: number,
    level: number,
    pid: number,
    msg: string,
    err?: string,
};