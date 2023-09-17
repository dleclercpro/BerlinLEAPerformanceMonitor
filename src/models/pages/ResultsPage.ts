import logger from '../../logger';
import { formatDateForFilename } from '../../utils/locale';
import AppointmentPage from './AppointmentPage';

class ResultsPage extends AppointmentPage {
    protected name = 'Results';

    public async checkForAppointments() {
        if (await this.hasErrorMessage()) {
            logger.info(`There are no appointments available at the moment. :'(`);
            return false;
        }

        // There seems to be an appointment: take a screenshot!
        await this.screenshot(`${formatDateForFilename(new Date())}.png`);

        logger.info(`There are appointments available right now! :)`);
        return true;
    }
}

export default ResultsPage;