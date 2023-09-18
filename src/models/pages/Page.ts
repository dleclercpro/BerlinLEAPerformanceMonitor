import { By } from 'selenium-webdriver';
import logger from '../../logger';
import Bot from '../bots/Bot';
import { INFINITE_TIME, SHORT_TIME } from '../../constants';
import { InfiniteSpinnerError, InternalServerError, TimeoutError } from '../../errors';
import { SCREENSHOTS_DIR } from '../../config';

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

    public async screenshot(filename: string) {
        await this.bot.scrollToTop();
        await this.bot.screenshot(`${SCREENSHOTS_DIR}/${filename}`);
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

    public async waitUntilLoaded() {
        logger.debug(`Wait for '${this.name}' page to load...`);

        if (await this.hasElement(ELEMENTS.Errors.InternalServerError)) {
            throw new InternalServerError();
        }

        await this.doWaitUntilLoaded();

        logger.debug('Page loaded.');
    }

    protected async waitUntilSpinnerGone() {
        if (!await this.isSpinnerVisible()) {
            return;
        }

        logger.trace(`Wait for spinner to disappear...`);

        return this.bot.waitForElementToDisappear(ELEMENTS.Icons.Spinner, INFINITE_TIME)
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