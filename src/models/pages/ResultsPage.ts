import logger from '../../logger';
import { formatDateForFilename } from '../../utils/locale';
import AppointmentPage from './AppointmentPage';

export const THERE_ARE_NO_APPOINTMENTS_LOG = `There are no appointments available at the moment. :'(`;
export const THERE_ARE_APPOINTMENTS_LOG = `There are appointments available right now! :)`;

class ResultsPage extends AppointmentPage {
    protected name = 'Results';

    public async checkForAppointments() {
        if (await this.hasErrorMessage()) {
            logger.info(THERE_ARE_NO_APPOINTMENTS_LOG);
            return false;
        }

        // There seems to be an appointment: take a screenshot!
        await this.screenshot(`${formatDateForFilename(new Date())}.png`);

        logger.info(THERE_ARE_APPOINTMENTS_LOG);
        return true;
    }
}

export default ResultsPage;