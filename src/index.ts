import { Environment } from './types';
import { ENV, EXPECTED_ERRORS } from './config';
import GetBlueCardAppointmentScenario from './models/scenarios/GetBlueCardAppointmentScenario';
import ChromeBot from './models/bots/ChromeBot';
import logger from './logger';



const executeOnce = async () => {
    const bot = new ChromeBot();

    return GetBlueCardAppointmentScenario.execute(bot)
        .then(() => false)
        .catch((err: any) => {
            const { name } = err as Error;
            const errorName = `${name}Error`;

            if (EXPECTED_ERRORS.map(e => e.name).includes(errorName)) {
                logger.error(`Expected error encountered: ${name}`);
            } else {
                logger.fatal(err, `An unknown error occurred!`);
            }

            return true;
        });
}



const execute = async () => {
    let done = false;

    while (!done) {
        const bot = new ChromeBot();

        const shouldExecuteAgain = await executeOnce();

        if (shouldExecuteAgain) {
            await bot.quit();
        } else {
            done = true;
        }
    }
}



if ([Environment.Development, Environment.Production].includes(ENV)) {
    execute();
}



export default execute;