import { Environment } from './types';
import { ENV } from './config';
import GetBlueCardAppointmentScenario from './models/scenarios/GetBlueCardAppointmentScenario';
import ChromeBot from './models/bots/ChromeBot';
import logger from './logger';
import { ElementMissingFromPageError, InfiniteSpinnerError, InternalServerError, PageStructureIntegrityError } from './errors';



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
                case InternalServerError.name:
                case ElementMissingFromPageError.name:
                case InfiniteSpinnerError.name:
                case PageStructureIntegrityError.name:
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