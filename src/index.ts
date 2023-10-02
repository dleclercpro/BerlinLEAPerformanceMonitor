import { Environment, TimeUnit } from './types';
import { ENV, N_ALARMS_ON_SUCCESS, TEST_ALARM } from './config';
import GetBlueCardAppointmentScenario from './models/scenarios/GetBlueCardAppointmentScenario';
import ChromeBot from './models/bots/ChromeBot';
import Bot from './models/bots/Bot';
import Alarm from './models/Alarm';
import { computeDate, sleep } from './utils/time';
import { getRange } from './utils/math';
import { VERY_SHORT_TIME } from './constants/times';
import JobScheduler from './models/jobs/JobScheduler';
import BotJob from './models/jobs/BotJob';
import { POLL, ONCE, BOT, ANALYZE, BOT_JOB_FREQUENCY } from './config/bot';
import logger from './logger';
import AnalysisJob from './models/jobs/AnalysisJob';
import TimeDuration from './models/TimeDuration';
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
    let executedOnce = false;

    if (TEST_ALARM) {
        await Alarm.ring();
    }

    if (BOT) {
        JobScheduler.schedule({
            job: new BotJob(),
            expression: BOT_JOB_FREQUENCY,
        });
    }

    if (ANALYZE) {
        const now = new Date();
        const lastWeek = computeDate(now, new TimeDuration(-7, TimeUnit.Days));

        await new AnalysisJob({ filepath: LOGS_FILEPATH, since: lastWeek }).execute();
    }

    // Poll
    while (POLL && (!ONCE || !executedOnce)) {
        const bot = new ChromeBot();

        if (await hasFoundAppointment(bot)) {
    
            // Play alarm one after the other to wake up
            // user!
            getRange(N_ALARMS_ON_SUCCESS).reduce(async () => {
                await Alarm.ring();
                await sleep(VERY_SHORT_TIME);
            }, Promise.resolve());
        }

        executedOnce = true;
    }
}



if ([Environment.Development, Environment.Production].includes(ENV)) {
    execute()
        .catch((err) => {
            logger.fatal(err, `Stopping everything. Uncaught error:`);

            // Stop all previously scheduled jobs
            JobScheduler.stopAll();
        });
}



export default execute;