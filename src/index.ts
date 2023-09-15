import { Environment } from './types';
import { ENV, LOGS_PATH, TEST_ALARM } from './config';
import GetBlueCardAppointmentScenario from './models/scenarios/GetBlueCardAppointmentScenario';
import ChromeBot from './models/bots/ChromeBot';
import Bot from './models/bots/Bot';
import { parseLogs } from './parser';
import SoundPlayer from './models/Alarm';
import minimist from 'minimist';



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



const parseArgs = (args: minimist.ParsedArgs) => {
    return {
        poll: [true, 'true'].includes(args.poll),
        endless: [true, 'true'].includes(args.endless),
        parse: [true, 'true'].includes(args.parse),
    };
}



const execute = async () => {
    const args = minimist(process.argv.slice(2))
    const { poll, parse, endless } = parseArgs(args);
    
    if (poll) {
        let done = false;

        if (TEST_ALARM) {
            await SoundPlayer.testAlarm();
        }

        while (endless || !done) {
            const bot = new ChromeBot();
    
            done = !(await shouldExecuteAgain(bot));
        }
    }

    if (parse) {
        await parseLogs(LOGS_PATH);
    }
}



if ([Environment.Development, Environment.Production].includes(ENV)) {
    execute();
}



export default execute;