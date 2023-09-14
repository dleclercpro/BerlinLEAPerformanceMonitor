import { By } from 'selenium-webdriver';
import Page from './Page';
import logger from '../../logger';
import { sleep } from '../../utils/time';
import TimeDuration, { TimeUnit } from '../TimeDuration';
import { SHORT_TIME } from '../../constants';

const TEXTS = {
    ApplyForVisa: 'Aufenthaltstitel - beantragen',
    Employment: 'Erwerbstätigkeit',
    BlueCard: 'Blaue Karte EU',
    NoAppointments: 'keine Termine frei',
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
        Submit: By.id('applicationForm:managedForm:proceed'),
    },
    Boxes: {
        Messages: By.id('messagesBox'),
    },
    Errors: {
        NoAppointments: By.xpath(`//li[@class='errorMessage' and contains(text(), '${TEXTS.NoAppointments}')]`),
    },
};

class AppointmentPage extends Page {
    protected name = 'Appointment';

    // Appointment page is available once the citizenship dropdown is visible
    protected async doWaitUntilLoaded() {
        await this.bot.waitForElement(ELEMENTS.Dropdown.Citizenship);

        // FIXME: wait for actual options to be populated
        await sleep(SHORT_TIME);
    }

    public async selectCitizenship(value: string) {
        const dropdown = await this.bot.findElement(ELEMENTS.Dropdown.Citizenship);

        logger.info(`Selecting citizenship: ${value}`);
        await dropdown.sendKeys(value);

        await this.bot.waitForElement(ELEMENTS.Dropdown.NumberOfApplicants);
    }

    public async selectNumberOfApplicants(value: string) {    
        const dropdown = await this.bot.findElement(ELEMENTS.Dropdown.NumberOfApplicants);

        logger.info(`Selecting number of applicants: ${value}`);
        await dropdown.sendKeys(value);

        await this.bot.waitForElement(ELEMENTS.Dropdown.WithRelatives);
    }

    public async selectWithRelatives(value: string) {
        const dropdown = await this.bot.findElement(ELEMENTS.Dropdown.WithRelatives);
    
        logger.info(`Selecting with relatives: ${value}`);
        await dropdown.sendKeys(value);

        await this.bot.waitForElement(ELEMENTS.Buttons.ApplyForVisa);
    }

    public async clickOnApplyForVisaButton() {
        const button = await this.bot.findElement(ELEMENTS.Buttons.ApplyForVisa);

        logger.info(`Clicking on request visa button.`);
        await button.click();

        await this.bot.waitForElement(ELEMENTS.Buttons.Employment);
    }

    public async clickOnEmploymentButton() {
        const button = await this.bot.findElement(ELEMENTS.Buttons.Employment);

        logger.info(`Clicking on work visa button.`);
        await button.click();

        await this.bot.waitForElement(ELEMENTS.Buttons.BlueCard);
    }

    public async clickOnBlueCardButton() {
        const button = await this.bot.findElement(ELEMENTS.Buttons.BlueCard);

        logger.info(`Clicking on blue card button.`);
        await button.click();

        await this.waitUntilSpinnerGone();
    }

    public async clickOnSubmitButton() {
        const button = await this.bot.findElement(ELEMENTS.Buttons.Submit);

        logger.info(`Clicking on submit button.`);
        await button.click();

        await this.waitUntilSpinnerGone();
    }

    public async hasErrorMessage() {
        try {
            await this.bot.findElement(ELEMENTS.Boxes.Messages);
            await this.bot.findElement(ELEMENTS.Errors.NoAppointments);
            return true;

        } catch (err: any) {
            logger.error(err);
            
            return false;
        }
    }
}

export default AppointmentPage;