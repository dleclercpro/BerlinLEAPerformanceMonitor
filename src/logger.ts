import pino, { TransportTargetOptions } from 'pino';
import pretty from 'pino-pretty';
import { LOGS_FILEPATH } from './config/file';
import { Environment } from './types';
import { POLL } from './config/bot';
import { PACKAGE_VERSION } from './constants';
import { ENV } from './config';

const getBindings = (bindings: pino.Bindings) => {
    return {
        ...bindings,
        version: PACKAGE_VERSION,
    };
}

const FORMATTERS = {
    bindings: getBindings,
};

const FILE_TRANSPORT: TransportTargetOptions = {
    level: 'info',
    target: 'pino/file',
    options: {
        destination: LOGS_FILEPATH,
    },
};

const CONSOLE_TRANSPORT: TransportTargetOptions = {
    level: 'debug',
    target: 'pino-pretty',
    options: {
        colorize: true,
        ignore: 'pid,hostname,version',
    },
};



const getLoggerByEnvironment = (env: Environment) => {
    switch (env) {
        case Environment.Test:
            return pino(pretty({ sync: true }));
        default:
            return getLoggerByUseCase();
    }
}

const getLoggerByUseCase = () => {
    // When polling, output all logs to file and terminal
    if (POLL) {
        return pino({
            level: 'trace',
            formatters: FORMATTERS,
            timestamp: pino.stdTimeFunctions.isoTime,
        }, pino.transport({
            targets: [FILE_TRANSPORT, CONSOLE_TRANSPORT],
        }));
    }

    // Otherwise, only terminal is sufficient
    return pino({
        level: 'debug',
        formatters: FORMATTERS,
        timestamp: pino.stdTimeFunctions.isoTime,
        transport: CONSOLE_TRANSPORT,
    });
}

export default getLoggerByEnvironment(ENV);