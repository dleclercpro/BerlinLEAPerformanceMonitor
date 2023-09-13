import { By } from 'selenium-webdriver';
import { HOMEPAGE_URL } from '../../constants';
import Page from './Page';

const ELEMENTS = {
    Buttons: {
        BookAppointment: By.xpath('//*[@id="mainForm"]/div/div/div/div/div/div/div/div/div/div[1]/div[1]/div[2]/a'),
    },
};

class HomePage extends Page {
    private static instance: HomePage;

    protected url: string = HOMEPAGE_URL;

    private constructor() {
        super();
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new HomePage();
        }

        return this.instance;
    }

    public getBookAppointmentButton() {
        return ELEMENTS.Buttons.BookAppointment;
    }
}

export default HomePage.getInstance();