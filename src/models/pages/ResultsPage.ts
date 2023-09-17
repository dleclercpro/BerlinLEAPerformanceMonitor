import { NoAppointmentsError } from '../../errors';
import logger from '../../utils/logging';
import SoundPlayer from '../Alarm';
import AppointmentPage from './AppointmentPage';

class ResultsPage extends AppointmentPage {
    protected name = 'Results';

    public async check() {
        if (await this.hasErrorMessage()) {
            logger.info(`There are no appointments available at the moment. :'(`);
            
            throw new NoAppointmentsError();
        }

        logger.info(`There are appointments available RIGHT NOW! :)`);

        // Play alarm to wake up user!
        await SoundPlayer.ringAlarm();
    }
}

export default ResultsPage;