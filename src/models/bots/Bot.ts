import { By, WebDriver, until } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';
import logger from '../../logger';
import TimeDuration from '../TimeDuration';
import { MEDIUM_TIME } from '../../constants/times';
import { AggregateError, GhostUIElementError, TimeoutError } from '../errors';
import { writeFile } from '../../utils/file';

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
    
        logger.trace(`Closing browser...`);
        await driver.quit();
        logger.trace(`Browser closed.`);
    }

    public async navigateTo(url: string) {
        const driver = await this.getDriver();

        await driver.get(url);
    }

    public async findElement(locator: By) {
        const driver = await this.getDriver();

        return driver.findElement(locator);
    }

    public async findElements(locator: By) {
        const driver = await this.getDriver();

        return driver.findElements(locator);
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
            .catch((err: unknown) => {
                let error = err;

                // Driver tried to find the element until it timed out
                if (err instanceof Error && err.name === TimeoutError.name) {
                    error = new GhostUIElementError();
                }

                throw error;
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
            .catch((err: unknown) => {
                let error = err;

                if (err instanceof Error && err.name === AggregateError.name) {
                    error = new TimeoutError();
                }

                throw error;
            })
    }

    public async scrollToTop() {
        const driver = await this.getDriver();

        logger.trace(`Scrolling to top of window...`);
        await driver.executeScript(`window.scrollTo(0, 0);`);
    }

    public async screenshot(filepath: string) {
        const driver = await this.getDriver();

        logger.trace(`Taking a screenshot...`);
        const img = await driver.takeScreenshot();
        
        await writeFile(filepath, img, true, 'base64');
        
        logger.trace(`Screenshot stored at '${filepath}'.`);
    }
}

export default Bot;