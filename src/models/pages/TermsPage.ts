import { By } from 'selenium-webdriver';
import Page from './Page';
import logger from '../../logger';

const TEXTS = {
    AcceptTerms: 'Ich erkläre hiermit',
};

const ELEMENTS = {
    Checkbox: {
        AcceptTerms: By.xpath(`//p[contains(text(), '${TEXTS.AcceptTerms}')]`),
    },
    Buttons: {
        Submit: By.id('applicationForm:managedForm:proceed'),
    },
};

class TermsPage extends Page {
    protected name = 'Terms';

    // Terms page is loaded once both the submit button and the checkbox 'accept terms'
    // are visible
    protected async doWaitUntilLoaded() {
        await this.bot.waitForElement(ELEMENTS.Checkbox.AcceptTerms);
        await this.bot.waitForElement(ELEMENTS.Buttons.Submit);
    }

    public async tickAcceptTermsCheckbox() {
        const checkbox = await this.bot.findElement(ELEMENTS.Checkbox.AcceptTerms);

        logger.info(`Tick accept terms checkbox.`);
        await checkbox.click();
    }

    public async clickOnNextButton() {
        const button = await this.bot.findElement(ELEMENTS.Buttons.Submit);

        logger.info(`Click on 'Next' button.`);
        await button.click();

        await this.waitUntilSpinnerGone();
    }
}

export default TermsPage;