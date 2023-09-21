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
import { POLL, ONCE, UPLOAD, BOT, ANALYZE } from './config/bot';
import { analyzeLogs } from './analysis';
import { LOGS_FILEPATH } from './config/file';



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
        let executedOnce = false;

        if (TEST_ALARM) {
            await Alarm.ring();
        }
        
        // When polling endlessly, generate graphs once in a while,
        // and upload them, if required
        if (BOT) {
            JobScheduler.schedule({
                job: new BotJob({ upload: UPLOAD, analyze: ANALYZE }),
                expression: EVERY_MINUTE_ZERO_AND_MINUTE_THIRTY,
            });
        }

        while (!ONCE || !executedOnce) {
            const bot = new ChromeBot();
    
            if (await hasFoundAppointment(bot)) {
        
                // Play alarm to wake up user!
                for (let _ of getRange(N_ALARMS_ON_SUCCESS)) {
                    await Alarm.ring();
                    await sleep(VERY_SHORT_TIME);
                }
            }

            executedOnce = true;
        }

        if (ONCE && ANALYZE) {
            await analyzeLogs(LOGS_FILEPATH);
        }
    }
}



if ([Environment.Development, Environment.Production].includes(ENV)) {
    execute();
}



export default execute;