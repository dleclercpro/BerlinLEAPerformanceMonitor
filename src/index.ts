import { Environment } from './types';
import { ENABLE_POLLING, ENABLE_PARSING, ENV, LOGS_PATH } from './config';
import GetBlueCardAppointmentScenario from './models/scenarios/GetBlueCardAppointmentScenario';
import ChromeBot from './models/bots/ChromeBot';
import Bot from './models/bots/Bot';
import { parseLogs } from './parser';



const executeOnce = async (bot: Bot) => {
    return GetBlueCardAppointmentScenario
        .execute(bot)
        .then(() => false)
        .catch(() => true);
}



const execute = async () => {
    if (ENABLE_POLLING) {
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

    if (ENABLE_PARSING) {
        await parseLogs(LOGS_PATH);
    }
}



if ([Environment.Development, Environment.Production].includes(ENV)) {
    execute();
}



export default execute;