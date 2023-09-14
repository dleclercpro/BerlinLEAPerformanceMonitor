import { By, WebDriver, until } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';
import logger from '../../logger';
import TimeDuration from '../TimeDuration';
import { LONG_TIME } from '../../constants';

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

    public async navigateTo(url: string) {
        const driver = await this.getDriver();

        await driver.get(url);
    }

    public async findElement(element: By) {
        const driver = await this.getDriver();

        return driver.findElement(element);
    }

    public async waitForElement(locator: By, timeout: TimeDuration = LONG_TIME) {
        const driver = await this.getDriver();

        if (timeout) {
            logger.trace(`Waiting with timeout of: ${timeout.format()}`);
        }

        const wait = timeout ? timeout.toMs().getAmount() : undefined;

        // Element should be present in DOM
        const element = await driver.wait(until.elementLocated(locator), wait);
        
        // Element should be visible in browser
        await driver.wait(until.elementIsVisible(element), wait);

        return element;
    }

    public async waitForElementToDisappear(locator: By) {
        const driver = await this.getDriver();

        const element = await this.findElement(locator);

        await Promise.any([
            driver.wait(until.elementIsNotVisible(element)),
            driver.wait(until.stalenessOf(element)),
        ]);
    }
}

export default Bot;