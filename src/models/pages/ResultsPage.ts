import { By } from 'selenium-webdriver';
import logger from '../../logger';
import { formatDateForFilename } from '../../utils/locale';
import AppointmentPage from './AppointmentPage';
import { NoAppointmentsError, NoInformationError } from '../../errors';
import { LogMessages } from '../../constants';

const TEXTS = {
    ApplyForVisa: 'Aufenthaltstitel - beantragen',
    Employment: 'Erwerbstätigkeit',
    BlueCard: 'Blaue Karte EU',
    NoAppointments: 'keine Termine frei',
    NoInformation: 'existieren keine Informationen',
};

const ELEMENTS = {
    Boxes: {
        Messages: By.id('messagesBox'),
    },
    Errors: {
        NoAppointments: By.xpath(`//li[@class='errorMessage' and contains(text(), '${TEXTS.NoAppointments}')]`),
        NoInformation: By.xpath(`//li[@class='errorMessage' and contains(text(), '${TEXTS.NoInformation}')]`),
    },
};

class ResultsPage extends AppointmentPage {
    protected name = 'Results';

    public async checkForAppointments() {
        if (await this.hasErrorMessage(ELEMENTS.Errors.NoInformation)) {
            logger.info(`There are no informations for the selected appointment. (?!?)`)
            throw new NoInformationError();
        }

        if (await this.hasErrorMessage(ELEMENTS.Errors.NoAppointments)) {
            logger.info(LogMessages.Failure);
            throw new NoAppointmentsError();
        }

        // There seems to be an appointment: take a screenshot!
        await this.screenshot(`${formatDateForFilename(new Date())}.png`);

        logger.info(LogMessages.Success);
        return true;
    }

    public async hasErrorMessage(locator: By) {
        return Promise.all([
            this.bot.findElement(ELEMENTS.Boxes.Messages),
            this.bot.findElement(locator),
        ])
        .then(() => {
            return true;
        })
        .catch(() => {
            return false;
        });
    }
}

export default ResultsPage;