import { By } from 'selenium-webdriver';
import logger from '../../logger';
import Bot from '../bots/Bot';
import { INFINITE_TIME, SHORT_TIME } from '../../constants/times';
import { TimeoutError } from '../errors';
import { SCREENSHOTS_DIR } from '../../config/file';
import { PACKAGE_VERSION } from '../../constants';
import InfiniteSpinnerError from '../errors/InfiniteSpinnerError';
import InternalServerError from '../errors/InternalServerError';
import ServiceUnavailableError from '../errors/ServiceUnavailableError';
import UndisclosedError from '../errors/UndisclosedError';

const TEXTS = {
    InternalServerError: '500 - Internal Server Error',
    ServiceUnavailable: '503 Service Unavailable',
    UndisclosedError: 'Fehler ist aufgetreten',
    Home: 'Startseite',
};

const ELEMENTS = {
    Errors: {
        InternalServerError: By.xpath(`//body[contains(text(), '${TEXTS.InternalServerError}')]`),
        ServiceUnavailable: By.xpath(`//body[contains(text(), '${TEXTS.ServiceUnavailable}')]`),
        UndisclosedError: By.xpath(`//body//*[contains(text(), '${TEXTS.UndisclosedError}')]`),
    },
    Buttons: {
        Home: By.xpath(`//a[@title=${TEXTS.Home}]`),
    },
    Icons: {
        Spinner: By.xpath(`//body/div[@class='loading'][1]`),
    },
};

abstract class Page {
    protected name: string = this.constructor.name;
    protected url: string = '';
    protected bot: Bot;

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
        await this.bot.screenshot(`${SCREENSHOTS_DIR}/v${PACKAGE_VERSION}/${filename}`);
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

        if (await this.hasElement(ELEMENTS.Errors.ServiceUnavailable)) {
            throw new ServiceUnavailableError();
        }

        if (await this.hasElement(ELEMENTS.Errors.UndisclosedError)) {
            throw new UndisclosedError();
        }

        await this.doWaitUntilLoaded();

        logger.debug('Page loaded.');
    }

    protected async waitUntilSpinnerGone() {
        if (!await this.isSpinnerVisible()) return;

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