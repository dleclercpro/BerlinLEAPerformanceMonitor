import pino from 'pino';
import pretty from 'pino-pretty';
import { ENV, ROOT_DIR } from './config';
import { Environment } from './types';

const getLogger = (env: Environment) => {
    switch (env) {
        case Environment.Test:
            return pino(pretty({
                sync: true,
            }));
        case Environment.Production:
            return pino(
                pino.transport({
                    targets: [{
                        level: 'info',
                        target: 'pino/file',
                        options: {
                            destination: `${ROOT_DIR}/data/app.log`,
                        },
                    }, {
                        level: 'trace',
                        target: 'pino-pretty',
                        options: {
                            
                        },
                    }],
                }),
            );
        case Environment.Development:
            return pino({
                level: 'trace', // Cannot use 'Severity' (why?!)
                transport: {
                    target: 'pino-pretty',
                },
            });
    }
}

export default getLogger(ENV);