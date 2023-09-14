import { Environment } from './types';
import { ENV } from './config';
import GetBlueCardAppointmentScenario from './models/scenarios/GetBlueCardAppointmentScenario';
import ChromeBot from './models/bots/ChromeBot';
import logger from './logger';
import { ElementMissingFromPageError, PageStructureError } from './errors';



const execute = async () => {
    let done = false;

    while (!done) {
        const bot = new ChromeBot();

        try {
            await GetBlueCardAppointmentScenario.execute(bot);

        } catch (err: any) {
            const { name } = err as Error;
            const errorName = `${name}Error`;

            switch (errorName) {
                case ElementMissingFromPageError.name:
                case PageStructureError.name:
                    logger.error(name);
                    break;
                default:
                    logger.fatal(err, `An unknown error occurred!`);
                    break;
                }
        
        } finally {
            await bot.quit();
        }
    }
}



if ([Environment.Development, Environment.Production].includes(ENV)) {
    execute();
}



export default execute;