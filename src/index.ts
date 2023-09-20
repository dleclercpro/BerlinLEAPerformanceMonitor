import { Environment } from './types';
import { ENDLESS, ENV, LOGS_PATH, N_ALARMS_ON_SUCCESS, ANALYZE, POLL, TEST_ALARM, UPLOAD } from './config';
import GetBlueCardAppointmentScenario from './models/scenarios/GetBlueCardAppointmentScenario';
import ChromeBot from './models/bots/ChromeBot';
import Bot from './models/bots/Bot';
import { analyzeLogs } from './analysis';
import Alarm from './models/Alarm';
import { sleep } from './utils/time';
import { getRange } from './utils/math';
import { EVERY_FIVE_MINUTES, EVERY_ONE_MINUTE, EVERY_THIRTY_MINUTES, VERY_SHORT_TIME } from './constants/times';
import JobScheduler from './models/jobs/JobScheduler';
import GenerateGraphsJob from './models/jobs/GenerateGraphsJob';
import UpdateDataJob from './models/jobs/UploadDataJob';



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
        
        // When polling endlessly, generate graphs once in a while
        if (ENDLESS) {
            JobScheduler.schedule({
                job: GenerateGraphsJob,
                expression: EVERY_FIVE_MINUTES,
                args: undefined,
            });

            if (UPLOAD) {
                JobScheduler.schedule({
                    job: UpdateDataJob,
                    expression: EVERY_THIRTY_MINUTES,
                    args: undefined,
                });
            }
        }

        while (ENDLESS || !executedOnce) {
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
    }

    if (ANALYZE) {
        await analyzeLogs(LOGS_PATH);
    }
}



if ([Environment.Development, Environment.Production].includes(ENV)) {
    execute();
}



export default execute;