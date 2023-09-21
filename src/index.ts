import { Environment } from './types';
import { ENV, N_ALARMS_ON_SUCCESS, TEST_ALARM } from './config';
import GetBlueCardAppointmentScenario from './models/scenarios/GetBlueCardAppointmentScenario';
import ChromeBot from './models/bots/ChromeBot';
import Bot from './models/bots/Bot';
import Alarm from './models/Alarm';
import { sleep } from './utils/time';
import { getRange } from './utils/math';
import { EVERY_MINUTE_ZERO_AND_MINUTE_THIRTY, EVERY_ONE_MINUTE, VERY_SHORT_TIME } from './constants/times';
import JobScheduler from './models/jobs/JobScheduler';
import BotJob from './models/jobs/BotJob';
import { POLL, ONCE, BOT, ANALYZE } from './config/bot';
import { analyzeLogs } from './analysis';
import { LOGS_FILEPATH } from './config/file';
import logger from './logger';



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
    let executedOnce = false;

    if (TEST_ALARM) {
        await Alarm.ring();
    }

    if (BOT) {
        JobScheduler.schedule({
            job: new BotJob(),
            expression: EVERY_MINUTE_ZERO_AND_MINUTE_THIRTY,
        });
    }

    if (ANALYZE) {
        await analyzeLogs(LOGS_FILEPATH);
    }

    // Poll 
    while (POLL && (!ONCE || !executedOnce)) {
        const bot = new ChromeBot();

        if (await hasFoundAppointment(bot)) {
    
            // Play alarm one after the other to wake up
            // user!
            for (let _ of getRange(N_ALARMS_ON_SUCCESS)) {
                await Alarm.ring();
                await sleep(VERY_SHORT_TIME);
            }
        }

        executedOnce = true;
    }
}



if ([Environment.Development, Environment.Production].includes(ENV)) {
    execute().catch((err) => {
        logger.fatal(`Stopping everything. Did not catch error: ${err}`);
    });
}



export default execute;