import { Environment } from './types';
import { ENV } from './config';
import GetBlueCardAppointmentScenario from './models/scenarios/GetBlueCardAppointmentScenario';
import ChromeBot from './models/bots/ChromeBot';
import logger from './logger';



const execute = async () => {
    const bot = new ChromeBot();

    try {
        await GetBlueCardAppointmentScenario.execute(bot);
    } catch (err: any) {
        logger.error(err.type);

        switch (err.type) {
            case 'NoSuchElementError':
                logger.error('Element not found!');
            default:
                logger.fatal(err);
        }

        // const driver = await bot.getDriver();

        // await driver.quit();
    }
}



if ([Environment.Development].includes(ENV)) {
    execute();
}



export default execute;