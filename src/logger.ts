import pino from 'pino';
import pretty from 'pino-pretty';
import { LOGS_FILEPATH } from './config/file';
import { Environment } from './types';
import { POLL } from './config/bot';

const getLoggerByEnvironment = (env: Environment) => {
    switch (env) {
        case Environment.Test:
            return pino(pretty({ sync: true }));
        case Environment.Development:
        case Environment.Production:
            return pino({
                level: 'debug',
                transport: {
                    target: 'pino-pretty',
                },
            });
    }
}

const getLoggerByUseCase = () => {
    // When polling, output all logs to file and terminal
    if (POLL) {
        return pino({
            level: 'trace',
        }, pino.transport({
            targets: [{
                level: 'info',
                target: 'pino/file',
                options: { destination: LOGS_FILEPATH },
            },
            {
                level: 'debug',
                target: 'pino-pretty',
                options: { },
            }],
        }));
    }

    // Otherwise, only terminal is sufficient
    return pino({
        level: 'debug',
        transport: {
            target: 'pino-pretty',
        },
    });
}

export default getLoggerByUseCase();