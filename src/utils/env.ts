import dotenv from 'dotenv';
import { Environment } from '../types';
import path from 'path';
import { ENVIRONMENTS } from '../constants';

export const loadEnvironment = () => {
    const env = process.env.ENV as Environment;
    
    if (env === undefined) {
        console.error(`Missing environment variable.`);
        process.exit(-1);    
    }
    
    if (!ENVIRONMENTS.includes(env)) {
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

export const getEnvironmentVariable = (name: string) => {
    const variable = process.env[name];

    if (!variable) {
        throw new Error(`Environment variable missing: ${name}`);
    }

    return variable;
}