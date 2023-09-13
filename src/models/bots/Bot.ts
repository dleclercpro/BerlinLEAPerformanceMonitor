import { By, WebDriver } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';
import Page from '../pages/Page';
import logger from '../../logger';

abstract class Bot {
    protected driver?: WebDriver;

    protected abstract name: string;
    protected abstract options: Options;

    protected abstract buildDriver(): Promise<void>;
    protected abstract prepareDriver(): Promise<void>;

    public async getDriver(): Promise<WebDriver> {
        if (!this.driver) {
            await this.buildDriver();
            await this.prepareDriver();
        }

        return this.driver!;
    }

    public async find(element: By) {
        if (!this.driver) throw new Error('Missing driver!');

        return this.driver.findElement(element);
    }

    public async visitPage(page: Page) {
        logger.info(`Visiting page: ${page.getUrl()}`);

        const driver = await this.getDriver();

        await driver.get(page.getUrl());
    }
}

export default Bot;