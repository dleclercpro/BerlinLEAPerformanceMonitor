import { By } from 'selenium-webdriver';
import logger from '../../logger';
import { formatDateForFilename } from '../../utils/locale';
import { LogMessage } from '../../constants';
import Page from './Page';
import { VERY_VERY_LONG_TIME } from '../../constants/times';
import FoundNoAppointmentError from '../errors/FoundNoAppointmentError';
import GhostUIElementError from '../errors/GhostUIElementError';
import NoAppointmentInformationError from '../errors/NoAppointmentInformationError';
import NoResultsError from '../errors/NoResultsError';

const TEXTS = {
    NoAppointment: 'keine Termine frei',
    NoInformation: 'existieren keine Informationen',
};

const DROPDOWN_NAMES = {
    Citizenship: 'sel_staat',
};

const ELEMENTS = {
    Dropdown: {
        Citizenship: By.xpath(`//select[@name='${DROPDOWN_NAMES.Citizenship}']`),
    },
    Bars: {
        RemainingTime: By.id('progressBar'),
    },
    Boxes: {
        Messages: By.id('messagesBox'),
    },
    Errors: {
        NoAppointment: By.xpath(`//li[@class='errorMessage' and contains(text(), '${TEXTS.NoAppointment}')]`),
        NoInformation: By.xpath(`//li[@class='errorMessage' and contains(text(), '${TEXTS.NoInformation}')]`),
    },
};

class ResultsPage extends Page {
    protected name = 'Results';

    protected async doWaitUntilLoaded() {
        return Promise.any([
            this.bot.waitForElement(ELEMENTS.Dropdown.Citizenship, VERY_VERY_LONG_TIME),
            this.bot.waitForElement(ELEMENTS.Boxes.Messages, VERY_VERY_LONG_TIME),
        ])
        .catch((err: unknown) => {
            let error = err;

            if (err instanceof Error && err.name === AggregateError.name) {
                error = new GhostUIElementError();
            }

            throw error;
        });
    }

    public async checkForAppointments() {
        logger.info(`Checking for appointments availability...`);

        if (await this.hasElement(ELEMENTS.Errors.NoInformation)) {
            logger.info(`There is no information available for the selected appointment.`);
            throw new NoAppointmentInformationError();
        }

        if (await this.hasElement(ELEMENTS.Errors.NoAppointment)) {
            logger.info(LogMessage.Failure);
            throw new FoundNoAppointmentError();
        }

        // Ensure there are no errors before concluding page hasn't changed (i.e. this
        // verification needs to happen last!)
        if (await this.hasElement(ELEMENTS.Dropdown.Citizenship)) {
            logger.info(`Returned to find appointment page.`);
            throw new NoResultsError();
        }

        // There seems to be an appointment: take a screenshot!
        await this.screenshot(`${formatDateForFilename(new Date())}.png`);

        // Record the successful event in the logs!
        logger.info(LogMessage.Success);

        return true;
    }
}

export default ResultsPage;