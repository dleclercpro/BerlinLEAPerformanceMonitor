import { CITIZENSHIP, NUMBER_OF_APPLICANTS, WITH_RELATIVES } from '../../config';
import { SHORT_TIME } from '../../constants';
import logger from '../../logger';
import { sleep } from '../../utils/time';
import Bot from '../bots/Bot';
import AppointmentPage from '../pages/AppointmentPage';
import HomePage from '../pages/HomePage';
import TermsPage from '../pages/TermsPage';
import Scenario from './Scenario';

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

    protected async doExecute(bot: Bot) {

        // Start of user journey: book an appointment
        const homePage = new HomePage(bot);
        await homePage.visit();
        await homePage.waitUntilLoaded();
        
        await homePage.clickOnBookAppointmentButton();

        // Agree to terms and conditions of LEA
        const termsPage = new TermsPage(bot);
        await termsPage.waitUntilLoaded();

        await termsPage.tickAcceptTermsCheckbox();
        await termsPage.clickOnSubmitButton();

        // Define user's appointment needs
        const appointmentPage = new AppointmentPage(bot);
        await appointmentPage.waitUntilLoaded();

        await appointmentPage.selectCitizenship(CITIZENSHIP);
        await appointmentPage.selectNumberOfApplicants(NUMBER_OF_APPLICANTS);
        await appointmentPage.selectWithRelatives(WITH_RELATIVES);

        await appointmentPage.clickOnApplyForVisaButton();
        await appointmentPage.clickOnEmploymentButton();
        await appointmentPage.clickOnBlueCardButton();
        
        await sleep(SHORT_TIME);

        await appointmentPage.clickOnSubmitButton();

        // Check results
        const resultsPage = new AppointmentPage(bot);
        await resultsPage.waitUntilLoaded();

        if (await resultsPage.hasErrorMessage()) {
            logger.info(`There are no appointments available at the moment. :'(`);
        } else {
            logger.warn(`There are appointments available RIGHT NOW! :)`);
        }
    }
}

export default GetBlueCardAppointmentScenario.getInstance();