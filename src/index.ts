import { Environment } from './types';
import { ENV } from './config';
import Bot from './models/Bot';
import GetBlueCardAppointment from './models/scenarios/GetBlueCardAppointment';



const execute = async () => {
    await GetBlueCardAppointment.execute(new Bot());
}



if ([Environment.Development].includes(ENV)) {
    execute();
}



export default execute;