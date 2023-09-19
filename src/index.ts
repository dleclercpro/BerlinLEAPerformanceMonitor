import { Environment } from './types';
import { ENDLESS, ENV, LOGS_PATH, N_ALARMS, ANALYZE, POLL, TEST_ALARM } from './config';
import GetBlueCardAppointmentScenario from './models/scenarios/GetBlueCardAppointmentScenario';
import ChromeBot from './models/bots/ChromeBot';
import Bot from './models/bots/Bot';
import { analyzeLogs } from './analysis';
import Alarm from './models/Alarm';
import { sleep } from './utils/time';
import { getRange } from './utils/math';
import { VERY_SHORT_TIME } from './constants/times';



const hasFoundAppointment = async (bot: Bot) => {
    return GetBlueCardAppointmentScenario
        .execute(bot)
        .then(() => {
            return true;
        })
        .catch(async () => {
            await bot.quit();

            return false;
        });
}



const execute = async () => {
    if (POLL) {
        TEST_ALARM && await Alarm.ring();

        let executedOnce = false;

        while (ENDLESS || !executedOnce) {
            const bot = new ChromeBot();
    
            if (await hasFoundAppointment(bot)) {
        
                // Play alarm to wake up user!
                for (let _ of getRange(N_ALARMS)) {
                    await Alarm.ring();
                    await sleep(VERY_SHORT_TIME);
                }
            }

            executedOnce = true;
        }
    }

    if (ANALYZE) {
        await analyzeLogs(LOGS_PATH);
    }
}



if ([Environment.Development, Environment.Production].includes(ENV)) {
    execute();
}



export default execute;