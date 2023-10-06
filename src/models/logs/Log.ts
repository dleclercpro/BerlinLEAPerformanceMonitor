import Release from '../Release';

type Args = {
    line: number,
    level: number,
    time: Date,
    version: Release,
    processId: number,
    hostname: string,
    message: string,
    error?: string,
}

class Log {
    private line: number;
    private level: number;
    private time: Date;
    private version: Release;
    private processId: number;
    private hostname: string;
    private message: string;
    private error?: string;

    constructor(args: Args) {
        const { line, level, time, version, processId, hostname, message, error } = args;

        this.line = line;
        this.level = level;
        this.time = time;
        this.version = version;
        this.processId = processId;
        this.hostname = hostname;
        this.message = message;
        this.error = error;
    }

    public static fromText(line: string, index: number) {
        const { level, time, version, pid, hostname, msg, err } = JSON.parse(line);

        return new Log({
            line: index + 1,
            level,
            time: new Date(time),
            version: Release.fromString(version),
            processId: pid,
            hostname,
            message: msg,
            error: err,
        });
    }

    public toString() {
        return (`{` +
            `"level":${this.level},` +
            `"time":"${this.time.toISOString()}",` +
            `"pid":${this.processId},` +
            `"hostname":"${this.hostname}",` +
            `"version":"${this.version.toString()}",` +
            (this.error ? `"err":"${this.error}",` : '') +
            `"msg":"${this.message}"` +
        `}`);
    }

    public getLine() {
        return this.line;
    }

    public getLevel() {
        return this.level;
    }

    public getTime() {
        return this.time;
    }

    public getVersion() {
        return this.version;
    }

    public hasMessage() {
        return !!this.message;
    }

    public getMessage() {
        return this.message;
    }

    public hasError() {
        return !!this.error;
    }

    public getError() {
        return this.error;
    }
}

export default Log;