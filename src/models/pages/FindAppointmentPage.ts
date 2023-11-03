import { By } from 'selenium-webdriver';
import Page from './Page';
import logger from '../../logger';
import { sleep } from '../../utils/time';
import { LONG_TIME, SHORT_TIME, VERY_VERY_LONG_TIME } from '../../constants/times';

const TEXTS = {
    ApplyForVisa: 'Aufenthaltstitel - beantragen',
    Employment: 'Erwerbstätigkeit',
    BlueCard: 'Blaue Karte EU',
    SkilledWorkerWithDegree: 'Fachkräfte mit akademischer Ausbildung',
};

const DROPDOWN_NAMES = {
    Citizenship: 'sel_staat',
    NumberOfApplicants: 'personenAnzahl_normal',
    WithRelatives: 'lebnBrMitFmly',
};

const ELEMENTS = {
    Dropdown: {
        Citizenship: By.xpath(`//select[@name='${DROPDOWN_NAMES.Citizenship}']`),
        NumberOfApplicants: By.xpath(`//select[@name='${DROPDOWN_NAMES.NumberOfApplicants}']`),
        WithRelatives: By.xpath(`//select[@name='${DROPDOWN_NAMES.WithRelatives}']`),
    },
    Buttons: {
        ApplyForVisa: By.xpath(`//p[contains(text(), '${TEXTS.ApplyForVisa}')]`),
        Employment: By.xpath(`//p[contains(text(), '${TEXTS.Employment}')]`),
        BlueCard: By.xpath(`//label[contains(text(), '${TEXTS.BlueCard}')]`),
        SkilledWorkerWithDegree: By.xpath(`//label[contains(text(), '${TEXTS.SkilledWorkerWithDegree}')]`),
        Submit: By.id('applicationForm:managedForm:proceed'),
    },
};

class FindAppointmentPage extends Page {
    protected name = 'FindAppointment';

    // Find appointment page is available once the citizenship dropdown is visible
    protected async doWaitUntilLoaded() {
        await this.bot.waitForElement(ELEMENTS.Dropdown.Citizenship, VERY_VERY_LONG_TIME);

        // FIXME: wait for actual options to be populated
        await sleep(SHORT_TIME);
    }

    public async selectCitizenship(option: string) {
        logger.info(`Select citizenship: ${option}`);

        const dropdown = await this.bot.findElement(ELEMENTS.Dropdown.Citizenship);
        await dropdown.sendKeys(option);
        await sleep(SHORT_TIME);
    }

    public async selectNumberOfApplicants(option: string) {    
        await this.bot.waitForElement(ELEMENTS.Dropdown.NumberOfApplicants);

        logger.info(`Select number of applicants: ${option}`);

        const dropdown = await this.bot.findElement(ELEMENTS.Dropdown.NumberOfApplicants);
        await dropdown.sendKeys(option);
        await sleep(SHORT_TIME);
    }

    public async selectWithRelatives(option: string) {
        await this.bot.waitForElement(ELEMENTS.Dropdown.WithRelatives);

        logger.info(`Select with relatives: ${option}`);

        const dropdown = await this.bot.findElement(ELEMENTS.Dropdown.WithRelatives);
        await dropdown.sendKeys(option);
        await sleep(SHORT_TIME);
    }

    public async clickOnApplyForVisaButton() {

        // It might take a while for the next UI element to show up: wait a bit longer...
        await this.bot.waitForElement(ELEMENTS.Buttons.ApplyForVisa, LONG_TIME);

        const button = await this.bot.findElement(ELEMENTS.Buttons.ApplyForVisa);

        logger.info(`Click on '${TEXTS.ApplyForVisa}' button.`);
        await button.click();
    }

    public async clickOnEmploymentButton() {
        await this.bot.waitForElement(ELEMENTS.Buttons.Employment);

        const button = await this.bot.findElement(ELEMENTS.Buttons.Employment);

        logger.info(`Click on '${TEXTS.Employment}' button.`);
        await button.click();
    }

    public async clickOnBlueCardButton() {
        await this.bot.waitForElement(ELEMENTS.Buttons.BlueCard);

        const button = await this.bot.findElement(ELEMENTS.Buttons.BlueCard);

        logger.info(`Click on '${TEXTS.BlueCard}' button.`);
        await button.click();

        await this.waitUntilSpinnerGone();
    }

    public async clickOnSkilledWorkerWithDegreeButton() {
        await this.bot.waitForElement(ELEMENTS.Buttons.SkilledWorkerWithDegree);

        const button = await this.bot.findElement(ELEMENTS.Buttons.SkilledWorkerWithDegree);

        logger.info(`Click on '${TEXTS.SkilledWorkerWithDegree}' button.`);
        await button.click();

        await this.waitUntilSpinnerGone();
    }

    public async clickOnNextButton() {
        const button = await this.bot.findElement(ELEMENTS.Buttons.Submit);

        logger.info(`Click on 'Next' button.`);
        await button.click();

        await this.waitUntilSpinnerGone();

        // Give some time for button to become 'clickable'
        await sleep(SHORT_TIME);
    }

    // There should be one and only one 'apply for visa' button on the page:
    // anything else is a UI bug
    public async isUIValid() {
        const elements = await this.bot.findElements(ELEMENTS.Buttons.ApplyForVisa);

        return elements.length === 1;
    }
}

export default FindAppointmentPage;