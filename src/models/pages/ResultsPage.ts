import { NoAppointmentsError } from '../../errors';
import logger from '../../logger';
import AppointmentPage from './AppointmentPage';

class ResultsPage extends AppointmentPage {
    protected name = 'Results';

    public async check() {
        if (await this.hasErrorMessage()) {
            logger.info(`There are no appointments available at the moment. :'(`);
            
            throw new NoAppointmentsError();
        }

        logger.info(`There are appointments available RIGHT NOW! :)`);
    }
}

export default ResultsPage;