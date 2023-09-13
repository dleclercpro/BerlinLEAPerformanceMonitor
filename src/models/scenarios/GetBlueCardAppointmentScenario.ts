import { until } from 'selenium-webdriver';
import Bot from '../bots/Bot';
import HomePage from '../pages/HomePage';
import TermsAndConditionsPage from '../pages/TermsAndConditionsPage';
import Scenario from './Scenario';
import AppointmentPage from '../pages/AppointmentPage';
import logger from '../../logger';

class GetBlueCardAppointmentScenario extends Scenario {
    private static instance: GetBlueCardAppointmentScenario;

    protected name: string = 'GetBlueCardAppointment';

    private constructor() {
        super();
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new GetBlueCardAppointmentScenario();
        }

        return this.instance;
    }

    protected async doExecute() {
        const bot = this.bot!;

        await bot.visitPage(HomePage);

        await this.startAppointmentSearch();
        await this.agreeToTermsAndConditions();
    }

    protected async startAppointmentSearch() {
        const bot = this.bot!;

        const button = await bot.find(HomePage.getBookAppointmentButton());
        logger.debug('Clicking on book appointment button.');
        await button.click();

        const driver = await bot.getDriver();
        await driver.wait(until.elementLocated(TermsAndConditionsPage.getAgreedCheckbox()));
    }

    protected async agreeToTermsAndConditions() {
        const bot = this.bot!;

        const checkbox = await bot.find(TermsAndConditionsPage.getAgreedCheckbox());
        logger.debug('Clicking on checkbox.');
        await checkbox.click();

        const button = await bot.find(TermsAndConditionsPage.getSubmitButton());
        logger.debug('Clicking on submit button.');
        await button.click();

        const driver = await bot.getDriver();
        await driver.wait(until.elementLocated(AppointmentPage.getCitizenshipDropdown()));
    }
}

export default GetBlueCardAppointmentScenario.getInstance();