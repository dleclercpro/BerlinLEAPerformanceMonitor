import { By } from 'selenium-webdriver';
import logger from '../../logger';
import { formatDateForFilename } from '../../utils/locale';
import { BackToFindAppointmentPageError, NoAppointmentsError, NoInformationError } from '../../errors';
import { LogMessages } from '../../constants';
import Page from './Page';
import { MEDIUM_TIME } from '../../constants/times';

const TEXTS = {
    NoAppointments: 'keine Termine frei',
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
        NoAppointments: By.xpath(`//li[@class='errorMessage' and contains(text(), '${TEXTS.NoAppointments}')]`),
        NoInformation: By.xpath(`//li[@class='errorMessage' and contains(text(), '${TEXTS.NoInformation}')]`),
    },
};

class ResultsPage extends Page {
    protected name = 'Results';

    protected async doWaitUntilLoaded() {
        await Promise.any([
            this.bot.waitForElement(ELEMENTS.Dropdown.Citizenship, MEDIUM_TIME),
            this.bot.waitForElement(ELEMENTS.Boxes.Messages, MEDIUM_TIME),
        ]);
    }

    public async checkForAppointments() {
        logger.info(`Checking for appointments availability...`);

        if (await this.hasElement(ELEMENTS.Dropdown.Citizenship)) {
            logger.info(`Returned to find appointment page.`);
            throw new BackToFindAppointmentPageError();
        }

        if (await this.hasElement(ELEMENTS.Errors.NoInformation)) {
            logger.info(`There is no information available for the selected appointment.`);
            throw new NoInformationError();
        }

        if (await this.hasElement(ELEMENTS.Errors.NoAppointments)) {
            logger.info(LogMessages.Failure);
            throw new NoAppointmentsError();
        }

        // There seems to be an appointment: take a screenshot!
        await this.screenshot(`${formatDateForFilename(new Date())}.png`);

        logger.info(LogMessages.Success);
        return true;
    }
}

export default ResultsPage;