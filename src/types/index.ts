export enum Environment {
    Development = 'development',
    Test = 'test',
    Production = 'production',
}

export type Log = {
    time: number,
    level: number,
    pid: number,
    msg: string,
    err?: string,
}