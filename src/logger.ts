import pino from 'pino';
import pretty from 'pino-pretty';
import { ENV } from './config';
import { Environment } from './types';

const logger = ENV === Environment.Test ?
    pino(pretty({ sync: true })) :
    pino({
        level: 'debug', // Cannot use 'Severity' (why?!)
        transport: {
            target: 'pino-pretty',
        },
    });

export default logger;