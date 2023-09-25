import { By } from 'selenium-webdriver';
import logger from '../../logger';
import { formatDateForFilename } from '../../utils/locale';
import { NoResultsError, NoAppointmentError, NoInformationError, ResultsPageDoesNotLoad } from '../../errors';
import { LogMessage } from '../../constants';
import Page from './Page';
import { MEDIUM_TIME } from '../../constants/times';

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
            this.bot.waitForElement(ELEMENTS.Dropdown.Citizenship, MEDIUM_TIME),
            this.bot.waitForElement(ELEMENTS.Boxes.Messages, MEDIUM_TIME),
        ])
        .catch((err: unknown) => {
            let error = err;

            if (err instanceof Error && err.name === AggregateError.name) {
                error = new ResultsPageDoesNotLoad();
            }

            throw error;
        });
    }

    public async checkForAppointments() {
        logger.info(`Checking for appointments availability...`);

        if (await this.hasElement(ELEMENTS.Errors.NoInformation)) {
            logger.info(`There is no information available for the selected appointment.`);
            throw new NoInformationError();
        }

        if (await this.hasElement(ELEMENTS.Errors.NoAppointment)) {
            logger.info(LogMessage.Failure);
            throw new NoAppointmentError();
        }

        // Ensure there are no errors before concluding page hasn't changed!
        if (await this.hasElement(ELEMENTS.Dropdown.Citizenship)) {
            logger.info(`Returned to find appointment page.`);
            throw new NoResultsError();
        }

        // There seems to be an appointment: take a screenshot!
        await this.screenshot(`${formatDateForFilename(new Date())}.png`);

        logger.info(LogMessage.Success);
        return true;
    }
}

export default ResultsPage;