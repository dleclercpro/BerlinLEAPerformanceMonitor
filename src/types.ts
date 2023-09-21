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

export type Size = {
    width: number,
    height: number,
}

export type GraphAxis = {
    label: string,
    unit?: string,
    min?: number,
    max?: number,
}

export interface GraphAxes {
    x: GraphAxis,
    y: GraphAxis,
}

export interface GitAuthor {
    name: string,
    email: string,
}

export interface GitRemote {
    name: string,
    url: string,
}

export interface VersionedData <Data> {
    version: number,
    data: Data,
}

export interface Comparable {
    compare(other: Comparable): -1 | 0 | 1;
    smallerThan(other: Comparable): boolean;
    smallerThanOrEquals(other: Comparable): boolean;
    equals(other: Comparable): boolean;
    greaterThanOrEquals(other: Comparable): boolean;
    greaterThan(other: Comparable): boolean;
}

export type ErrorCounts = Record<string, number>;

export type Log = {
    line: number,
    time: number,
    level: number,
    pid: number,
    msg: string,
    err?: string,
};