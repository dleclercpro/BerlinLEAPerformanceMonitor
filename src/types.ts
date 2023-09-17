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

export type Log = {
    time: number,
    level: number,
    pid: number,
    msg: string,
    err?: string,
}