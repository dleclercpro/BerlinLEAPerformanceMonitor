import { By } from 'selenium-webdriver';
import Page from './Page';
import logger from '../../logger';
import { VERY_VERY_LONG_TIME } from '../../constants';

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

    // Terms page is loaded once both checkbox 'accept terms' is visible
    protected async doWaitUntilLoaded() {
        await this.bot.waitForElement(ELEMENTS.Checkbox.AcceptTerms, VERY_VERY_LONG_TIME);
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