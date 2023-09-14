import { By, WebDriver, until } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';
import logger from '../../logger';
import TimeDuration from '../TimeDuration';
import { MEDIUM_TIME } from '../../constants';
import { ElementMissingFromPageError } from '../../errors';

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

    public async quit() {
        const driver = await this.getDriver();
    
        await driver.quit();
    }

    public async navigateTo(url: string) {
        const driver = await this.getDriver();

        await driver.get(url);
    }

    public async findElement(element: By) {
        const driver = await this.getDriver();

        return driver.findElement(element);
    }

    public async waitForElement(locator: By, wait: TimeDuration = MEDIUM_TIME) {
        const driver = await this.getDriver();

        if (wait) {
            logger.trace(`Wait for element... (${wait.format()})`);
        } else {
            logger.trace(`Wait for element...`);
        }

        const timeout = wait?.toMs().getAmount();

        try {
            // Element should be present in DOM
            const element = await driver.wait(until.elementLocated(locator), timeout);
            
            // Element should be visible in browser
            await driver.wait(until.elementIsVisible(element), timeout);

            return element;
        
        } catch (err: any) {
            const { name } = err;

            switch (name) {
                // Searching for element times out: element is missing from page!
                case 'TimeoutError':
                    throw new ElementMissingFromPageError();
                default:
                    throw err;
            }
        }
    }

    public async waitForElementToDisappear(locator: By, wait?: TimeDuration) {
        const driver = await this.getDriver();

        const element = await this.findElement(locator);
        const timeout = wait?.toMs().getAmount();

        await Promise.any([
            driver.wait(until.elementIsNotVisible(element), timeout),
            driver.wait(until.stalenessOf(element), timeout),
        ]);
    }
}

export default Bot;