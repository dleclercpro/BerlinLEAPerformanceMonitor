import { CITIZENSHIP, NUMBER_OF_APPLICANTS, WITH_RELATIVES } from '../../config';
import { SHORT_TIME } from '../../constants';
import { sleep } from '../../utils/time';
import Bot from '../bots/Bot';
import AppointmentPage from '../pages/AppointmentPage';
import HomePage from '../pages/HomePage';
import ResultsPage from '../pages/ResultsPage';
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
        await termsPage.clickOnNextButton();

        // Define user's appointment needs
        const appointmentPage = new AppointmentPage(bot);
        await appointmentPage.waitUntilLoaded();

        await appointmentPage.selectCitizenship(CITIZENSHIP);
        await appointmentPage.selectNumberOfApplicants(NUMBER_OF_APPLICANTS);
        await appointmentPage.selectWithRelatives(WITH_RELATIVES);

        await appointmentPage.clickOnApplyForVisaButton();
        await appointmentPage.clickOnEmploymentButton();
        await appointmentPage.clickOnBlueCardButton();
        
        // FIXME: wait for 'next' button to be clickable (?)
        await sleep(SHORT_TIME);

        await appointmentPage.clickOnNextButton();

        // Check results
        const resultsPage = new ResultsPage(bot);
        await resultsPage.waitUntilLoaded();

        await resultsPage.check();
    }
}

export default GetBlueCardAppointmentScenario.getInstance();