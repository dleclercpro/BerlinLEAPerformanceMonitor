import dotenv from 'dotenv';
import { Environment } from '../types';
import path from 'path';

export const loadEnvironment = () => {
    const env = process.env.ENV as Environment;
    
    if (env === undefined) {
        console.error(`Missing environment variable.`);
        process.exit(-1);    
    }
    
    if (!Object.values(Environment).includes(env)) {
        console.error(`Invalid environment variable: '${env}'`);
        process.exit(-1);
    }
    
    // Load environment variables
    dotenv.config({
        path: path.resolve(process.cwd(), `.env.${env}`),
    });
    console.debug(`Loaded environment: '${env}'\n`);

    return env;
}