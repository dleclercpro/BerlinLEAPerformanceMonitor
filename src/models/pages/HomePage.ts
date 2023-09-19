import { By } from 'selenium-webdriver';
import { HOMEPAGE_URL, SHORT_TIME, VERY_VERY_LONG_TIME } from '../../constants';
import Page from './Page';
import logger from '../../logger';
import { ConstructionWorkError } from '../../errors';

const TEXTS = {
    BookAppointment: 'Termin buchen',
    ConstructionWork: 'Wartungsarbeiten',
};

const ELEMENTS = {
    Buttons: {
        BookAppointment: By.xpath(`//a[contains(text(), '${TEXTS.BookAppointment}')]`),
    },
    Errors: {
        ConstructionWork: By.xpath(`//div[@id=maintWarning]/ul[@class='notificationBox']/li[@class='warnMessage' and contains(text(), '${TEXTS.ConstructionWork}')]`),
    },
};

class HomePage extends Page {
    protected name = 'Home';
    protected url: string = HOMEPAGE_URL;

    // Home page is loaded once the 'book appointment' button is visible
    protected async doWaitUntilLoaded() {
        try {
            await this.bot.waitForElement(ELEMENTS.Buttons.BookAppointment, SHORT_TIME);
        } catch {
            await this.bot.waitForElement(ELEMENTS.Errors.ConstructionWork, SHORT_TIME);
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