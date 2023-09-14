import { Environment } from './types';
import { ENV, EXPECTED_ERRORS } from './config';
import GetBlueCardAppointmentScenario from './models/scenarios/GetBlueCardAppointmentScenario';
import ChromeBot from './models/bots/ChromeBot';
import logger from './logger';
import Bot from './models/bots/Bot';



const executeOnce = async (bot: Bot) => {
    return GetBlueCardAppointmentScenario
        .execute(bot)
        .then(() => {
            logger.info(`An appointment was found.`);

            return false;
        })
        .catch((err: any) => {
            const { name } = err as Error;

            if (EXPECTED_ERRORS.map(e => e.name).includes(name)) {
                logger.error(`Expected error encountered: ${name}`);
            } else {
                logger.fatal(err, `An unknown error occurred!`);
            }

            return true;
        });
}



const execute = async () => {
    let done = false;

    while (!done) {
        const bot = new ChromeBot();

        if (await executeOnce(bot)) {
            await bot.quit();
        } else {
            done = true;
        }
    }
}



if ([Environment.Development, Environment.Production].includes(ENV)) {
    execute();
}



export default execute;