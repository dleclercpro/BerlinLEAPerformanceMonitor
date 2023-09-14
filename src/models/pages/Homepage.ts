import { By } from 'selenium-webdriver';
import { HOMEPAGE_URL } from '../../constants';
import Page from './Page';
import logger from '../../logger';

const TEXTS = {
    BookAppointment: 'Termin buchen',
};

const ELEMENTS = {
    Buttons: {
        BookAppointment: By.xpath(`//a[contains(text(), '${TEXTS.BookAppointment}')]`),
    },
};

class HomePage extends Page {
    protected name = 'Home';
    protected url: string = HOMEPAGE_URL;

    // Home page is loaded once the 'book appointment' button is visible
    protected async doWaitUntilLoaded() {
        await this.bot.waitForElement(ELEMENTS.Buttons.BookAppointment);
    }

    public async clickOnBookAppointmentButton() {
        const button = await this.bot.findElement(ELEMENTS.Buttons.BookAppointment);

        logger.info(`Click on book appointment button.`);
        await button.click();
    }
}

export default HomePage;