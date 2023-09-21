import { By } from 'selenium-webdriver';
import Page from './Page';
import logger from '../../logger';
import { ConstructionWorkError } from '../../errors';
import { MEDIUM_TIME } from '../../constants/times';
import { HOMEPAGE_URL } from '../../config';

const TEXTS = {
    BookAppointment: 'Termin buchen',
    ConstructionWork: 'Wartungsarbeiten',
};

const ELEMENTS = {
    Buttons: {
        BookAppointment: By.xpath(`//a[contains(text(), '${TEXTS.BookAppointment}')]`),
    },
    Errors: {
        ConstructionWork: By.id(`maintWarning`),
    },
};

class HomePage extends Page {
    protected name = 'Home';
    protected url: string = HOMEPAGE_URL;

    // Home page is loaded once the 'book appointment' button is visible
    protected async doWaitUntilLoaded() {
        try {
            await this.bot.waitForElement(ELEMENTS.Buttons.BookAppointment, MEDIUM_TIME);
        } catch {
            await this.bot.waitForElement(ELEMENTS.Errors.ConstructionWork, MEDIUM_TIME);
            throw new ConstructionWorkError();
        }
    }

    public async clickOnBookAppointmentButton() {
        const button = await this.bot.findElement(ELEMENTS.Buttons.BookAppointment);

        logger.info(`Click on book appointment button.`);
        await button.click();
    }
}

export default HomePage;