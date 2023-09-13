import { By } from 'selenium-webdriver';
import Page from './Page';

const ELEMENTS = {
    Checkbox: {
        Agreed: By.id('xi-cb-1'),
    },
    Buttons: {
        Submit: By.id('applicationForm:managedForm:proceed'),
    },
};

class TermsAndConditionsPage extends Page {
    private static instance: TermsAndConditionsPage;

    private constructor() {
        super();
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new TermsAndConditionsPage();
        }

        return this.instance;
    }

    public getAgreedCheckbox() {
        return ELEMENTS.Checkbox.Agreed;
    }

    public getSubmitButton() {
        return ELEMENTS.Buttons.Submit;
    }
}

export default TermsAndConditionsPage.getInstance();