import { By } from 'selenium-webdriver';
import logger from '../../utils/logging';
import Bot from '../bots/Bot';
import { SHORT_TIME, VERY_VERY_LONG_TIME } from '../../constants';
import TimeDuration from '../TimeDuration';
import { InfiniteSpinnerError, InternalServerError, TimeoutError } from '../../errors';
import { sleep } from '../../utils/time';

const TEXTS = {
    InternalServerError: '500 - Internal Server Error',
    Home: 'Startseite',
};

const ELEMENTS = {
    Errors: {
        InternalServerError: By.xpath(`//body[contains(text(), '${TEXTS.InternalServerError}')]`),
    },
    Buttons: {
        Home: By.xpath(`//a[@title=${TEXTS.Home}]`),
    },
    Icons: {
        Spinner: By.xpath(`//body/div[@class='loading'][1]`),
    },
};

abstract class Page {
    protected url: string = '';
    protected bot: Bot;

    protected abstract name: string;

    protected abstract doWaitUntilLoaded(): Promise<void>;

    public constructor(bot: Bot) {
        this.bot = bot;
    }

    public getUrl() {
        return this.url;
    }

    public async visit() {
        logger.debug(`Visit page: ${this.url}`);

        await this.bot.navigateTo(this.url);
    }

    public async waitUntilLoaded() {
        logger.debug(`Wait for '${this.name}' page to load...`);

        if (await this.hasElement(ELEMENTS.Errors.InternalServerError)) {
            throw new InternalServerError();
        }

        await this.doWaitUntilLoaded();

        logger.debug('Page loaded.');
    }

    public async hasElement(locator: By) {
        return this.bot.findElement(locator)
            .then(() => {
                logger.trace(`Page '${this.name}' has element '${locator.toString()}'.`);
                return true;
            })
            .catch(() => {
                logger.trace(`Page '${this.name}' does not have element '${locator.toString()}'.`);
                return false;
            });
    }

    protected async selectDropdownOption(locator: By, option: string) {
        const dropdown = await this.bot.findElement(locator);

        await dropdown.sendKeys(option);

        // Seems dropdowns need a little time
        await sleep(SHORT_TIME);
    }

    protected async waitUntilSpinnerGone(wait: TimeDuration = VERY_VERY_LONG_TIME) {
        if (!await this.isSpinnerVisible()) {
            return;
        }

        logger.trace(`Wait for spinner to disappear...`);

        return this.bot.waitForElementToDisappear(ELEMENTS.Icons.Spinner, wait)
            .then(() => {
                logger.trace(`Spinner is gone.`);
            })
            .catch(err => {
                const { name } = err;

                switch (name) {
                    case TimeoutError.name:
                        throw new InfiniteSpinnerError();
                    default:
                        throw err;
                }
            });
    }

    private async isSpinnerVisible() {
        logger.trace(`Search spinner...`);

        return this.bot.waitForElement(ELEMENTS.Icons.Spinner, SHORT_TIME)
            .then(() => {
                logger.trace(`Spinner found.`);
                return true;
            })
            .catch(() => {
                logger.warn(`Spinner not found.`);
                return false;
            });
    }
}

export default Page;