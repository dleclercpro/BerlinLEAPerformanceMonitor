import { Environment } from './types';
import { ENV } from './config';
import Bot from './models/Bot';
import { BERLIN_LEA_URL } from './constants';



const execute = async () => {
    const bot = new Bot(BERLIN_LEA_URL);
}



if ([Environment.Development].includes(ENV)) {
    execute();
}



export default execute;