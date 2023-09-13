import logger from '../logger';
import { Browser, Builder, WebDriver } from 'selenium-webdriver';
import Page from './pages/Page';

class Bot {
    protected browser: string;
    protected driver?: WebDriver;

    public constructor(browser: string = Browser.CHROME) {
        this.browser = browser;
    }

    protected async getDriver() {
        if (!this.driver) {
            this.driver = await new Builder().forBrowser(this.browser).build();
        }

        return this.driver;
    }

    public async visitPage(page: Page) {
        logger.info(`Visiting page: ${page.getUrl()}`);

        const driver = await this.getDriver();

        await driver.get(page.getUrl());
    }
}

export default Bot;