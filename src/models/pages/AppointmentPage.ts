import { By } from 'selenium-webdriver';
import Page from './Page';

const ELEMENTS = {
    Dropdown: {
        Citizenship: By.id('xi-sel-400'),
        NumberOfApplicants: By.id('xi-sel-422'),
        WithRelatives: By.id('xi-sel-427'),
    },
    Buttons: {
        Submit: By.xpath('applicationForm:managedForm:proceed'),
        RequestVisa: By.xpath('//*[@id="xi-div-30"]/div[1]/label/p'),
        WorkVisa: By.xpath('//*[@id="inner-348-0-1"]/div/div[3]/label/p'),
        BlueCard: By.xpath('//*[@id="inner-348-0-1"]/div/div[4]/div/div[14]/label'),
    },
};

class AppointmentPage extends Page {
    private static instance: AppointmentPage;

    private constructor() {
        super();
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new AppointmentPage();
        }

        return this.instance;
    }

    public getCitizenshipDropdown() {
        return ELEMENTS.Dropdown.Citizenship;
    }

    public getNumberOfApplicantsDropdown() {
        return ELEMENTS.Dropdown.NumberOfApplicants;
    }

    public getWithRelativesDropdown() {
        return ELEMENTS.Dropdown.WithRelatives;
    }

    public getSubmitButton() {
        return ELEMENTS.Buttons.Submit;
    }
}

export default AppointmentPage.getInstance();