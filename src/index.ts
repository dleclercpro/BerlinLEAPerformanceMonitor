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
import { POLL, ONCE, BOT, ANALYZE, BOT_JOB_FREQUENCY, CLEAN, LOG_ROTATION_JOB_FREQUENCY } from './config/bot';
import logger from './logger';
import AnalysisJob from './models/jobs/AnalysisJob';
import TimeDuration from './models/units/TimeDuration';
import { LOGS_DIR, LOGS_FILEPATH } from './config/file';
import { parseLogs } from './utils/parsing';
import SessionHistoryBuilder from './models/sessions/SessionHistoryBuilder';
import SessionHistoryExporter from './models/sessions/SessionHistoryExporter';
import Release from './models/Release';
import { verifyDiskSpace } from './utils/file';
import LogRotationJob from './models/jobs/LogRotationJob';



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

    // Ensure there's enough disk space
    await verifyDiskSpace();

    // Schedule bot-related job
    if (BOT) {
        JobScheduler.schedule({
            job: new LogRotationJob(),
            expression: LOG_ROTATION_JOB_FREQUENCY,
        });

        JobScheduler.schedule({
            job: new BotJob(),
            expression: BOT_JOB_FREQUENCY,
        });
    }

    // Analyze sessions locally
    if (!BOT && ANALYZE) {
        const now = new Date();
        const lastWeek = computeDate(now, new TimeDuration(-7, TimeUnit.Days));
        const specificRelease = new Release(1, 8, 1);

        await new AnalysisJob({ dir: LOGS_DIR, since: specificRelease }).execute();
    }

    // Clean logs (remove incomplete sessions)
    if (CLEAN) {
        const logs = await parseLogs(LOGS_FILEPATH);
    
        const history = SessionHistoryBuilder.build(logs);

        await SessionHistoryExporter.exportToLogFile(`${LOGS_DIR}/app-clean.log`, history);
    }

    // Gather performance data from LEA by running user sessions sequentially
    if (POLL) {
        let executedOnce = false;

        if (TEST_ALARM) {
            await Alarm.ring();
        }

        while (!ONCE || !executedOnce) {
            const bot = new ChromeBot();
    
            // Ensure there's enough disk space
            await verifyDiskSpace();

            if (await hasFoundAppointment(bot)) {
        
                // Play alarm a given number of times sequentially in order to
                // wake up user!
                getRange(N_ALARMS_ON_SUCCESS).reduce(async () => {
                    await Alarm.ring();
                    await sleep(VERY_SHORT_TIME);
                }, Promise.resolve());
            }
    
            executedOnce = true;
        }   
    }
}



if ([Environment.Development, Environment.Production].includes(ENV)) {
    execute()
        .catch((err) => {
            logger.fatal(err, `Stopped everything. Uncaught error:`);

            // Stop all previously scheduled jobs
            if (JobScheduler.hasScheduledJobs()) {
                JobScheduler.stopAll();
            }
        });
}



export default execute;