import { Environment } from './types';
import { ENV } from './config';
import GetBlueCardAppointmentScenario from './models/scenarios/GetBlueCardAppointmentScenario';
import ChromeBot from './models/bots/ChromeBot';



const execute = async () => {
    const bot = new ChromeBot();

    await GetBlueCardAppointmentScenario.execute(bot);
}



if ([Environment.Development].includes(ENV)) {
    execute();
}



export default execute;