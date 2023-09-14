import { CITIZENSHIP, NUMBER_OF_APPLICANTS, WITH_RELATIVES } from '../../config';
import { SHORT_TIME } from '../../constants';
import logger from '../../logger';
import { sleep } from '../../utils/time';
import TimeDuration, { TimeUnit } from '../general/TimeDuration';
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

    protected async doExecute() {
        const bot = this.bot!;

        // Home page
        const homePage = new HomePage(bot);
        await homePage.visit();
        await homePage.waitUntilLoaded();
        
        await homePage.clickOnBookAppointmentButton();

        // Terms page
        const termsPage = new TermsPage(bot);
        await termsPage.waitUntilLoaded();

        await termsPage.tickAcceptTermsCheckbox();
        await termsPage.clickOnSubmitButton();

        // Appointment page
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