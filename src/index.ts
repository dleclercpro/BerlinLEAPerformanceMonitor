import { Environment } from './types';
import { ENV } from './config';
import GetBlueCardAppointmentScenario from './models/scenarios/GetBlueCardAppointmentScenario';
import ChromeBot from './models/bots/ChromeBot';
import logger from './logger';



const execute = async () => {
    while (true) {
        const bot = new ChromeBot();

        try {
            await GetBlueCardAppointmentScenario.execute(bot);

        } catch (err: any) {
            logger.error(err);
        
        } finally {
            const driver = await bot.getDriver();
    
            await driver.quit();
        }
    }
}



if ([Environment.Development].includes(ENV)) {
    execute();
}



export default execute;