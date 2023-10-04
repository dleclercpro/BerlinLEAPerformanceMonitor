import { Environment, TimeUnit } from './types';
import { ENV, N_ALARMS_ON_SUCCESS, TEST_ALARM } from './config';
import GetBlueCardAppointmentScenario from './models/scenarios/GetBlueCardAppointmentScenario';
import ChromeBot from './models/bots/ChromeBot';
import Bot from './models/bots/Bot';
import Alarm from './models/Alarm';
import { computeDate, sleep } from './utils/time';
import { getRange } from './utils/math';
import { ONE_HOUR, VERY_SHORT_TIME } from './constants/times';
import JobScheduler from './models/jobs/JobScheduler';
import BotJob from './models/jobs/BotJob';
import { POLL, ONCE, BOT, ANALYZE, BOT_JOB_FREQUENCY, CLEAN } from './config/bot';
import logger from './logger';
import AnalysisJob from './models/jobs/AnalysisJob';
import TimeDuration from './models/TimeDuration';
import { LOGS_DIR, LOGS_FILEPATH } from './config/file';
import { parseLogs } from './utils/parsing';
import SessionHistoryBuilder from './models/sessions/SessionHistoryBuilder';
import SessionHistoryExporter from './models/sessions/SessionHistoryExporter';



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

    if (!BOT && ANALYZE) {
        const now = new Date();
        const lastWeek = computeDate(now, new TimeDuration(-7, TimeUnit.Days));

        await new AnalysisJob({ filepath: LOGS_FILEPATH, since: lastWeek }).execute();
    }

    // Clean logs (remove incomplete sessions)
    if (CLEAN) {
        const logs = await parseLogs(LOGS_FILEPATH);
    
        const history = SessionHistoryBuilder.build(logs);

        await SessionHistoryExporter.exportToLogFile(`${LOGS_DIR}/app-clean.log`, history);
    }

    // Poll
    while (POLL && (!ONCE || !executedOnce)) {
        const bot = new ChromeBot();

        if (await hasFoundAppointment(bot)) {
    
            // Play alarm one after the other to wake up user!
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