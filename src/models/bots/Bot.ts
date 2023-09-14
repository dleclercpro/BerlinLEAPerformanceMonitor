import { By, WebDriver, until } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';
import logger from '../../logger';
import TimeDuration from '../TimeDuration';
import { MEDIUM_TIME } from '../../constants';
import { ElementMissingFromPageError, TimeoutError } from '../../errors';

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
    
        logger.debug(`Closing browser...`);
        await driver.quit();
        logger.debug(`Browser closed.`);
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
        const timeout = wait?.toMs().getAmount();

        logger.trace(`Wait for element '${locator.toString()}'...` + (wait ? ' ' + `(${wait.format()})` : ''));

        // Element should be present in DOM
        return driver.wait(until.elementLocated(locator), timeout)
            // Element should be visible in browser
            .then((element) => driver.wait(until.elementIsVisible(element), timeout))
            .then(() => {
                logger.trace(`Found element.`);
            })
            .catch((err: any) => {
                const { name } = err;
    
                switch (name) {
                    case TimeoutError.name:
                        throw new ElementMissingFromPageError();
                    default:
                        throw err;
                }
            });
    }

    public async waitForElementToDisappear(locator: By, wait?: TimeDuration) {
        const driver = await this.getDriver();
        const timeout = wait?.toMs().getAmount();
        const element = await this.findElement(locator);

        logger.trace(`Wait for element '${locator.toString()}' to disappear...` + (wait ? ' ' + `(${wait!.format()})` : ''));
        
        // Either element should become invisible or be removed from DOM
        return Promise.any([
                driver.wait(until.elementIsNotVisible(element), timeout),
                driver.wait(until.stalenessOf(element), timeout),
            ])
            .then(() => {
                logger.trace(`Element is gone.`);
            })
            .catch((err: any) => {
                const { name } = err;

                switch (name) {
                    case AggregateError.name:
                        throw new TimeoutError();
                    default:
                        throw err;
                }
            })
    }
}

export default Bot;