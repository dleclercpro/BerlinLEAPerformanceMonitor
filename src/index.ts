import { Environment } from './types';
import { ENABLE_POLLING, ENABLE_PARSING, ENV, LOGS_PATH, ALARM_PATH } from './config';
import GetBlueCardAppointmentScenario from './models/scenarios/GetBlueCardAppointmentScenario';
import ChromeBot from './models/bots/ChromeBot';
import Bot from './models/bots/Bot';
import { parseLogs } from './parser';
import SoundPlayer from './models/SoundPlayer';



const shouldExecuteAgain = async (bot: Bot) => {
    return GetBlueCardAppointmentScenario
        .execute(bot)
        .then(() => {
            return false;
        })
        .catch(async () => {
            await bot.quit();
            return true;
        });
}



const execute = async () => {
    if (ENABLE_POLLING) {
        let done = false;

        // Test alarm
        await new SoundPlayer().play(ALARM_PATH);

        while (!done) {
            const bot = new ChromeBot();
    
            done = !(await shouldExecuteAgain(bot));
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