import { By } from 'selenium-webdriver';
import logger from '../../logger';
import Bot from '../bots/Bot';
import { SHORT_TIME } from '../../constants';

const TEXTS = {
    Home: 'Startseite',
};

const ELEMENTS = {
    Buttons: {
        Home: By.xpath(`//a[@title=${TEXTS.Home}]`),
    },
    Icons: {
        Spinner: By.xpath('//body/div[@class="loading"][1]'),
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

        await this.doWaitUntilLoaded();

        logger.debug('Page loaded.');
    }

    protected async waitUntilSpinnerGone() {
        if (await this.isSpinnerVisible()) {
            logger.trace(`Wait for spinner to disappear...`);

            await this.bot.waitForElementToDisappear(ELEMENTS.Icons.Spinner);

            logger.trace(`Spinner is gone.`);
        }
    }

    private async isSpinnerVisible() {
        try {
            logger.trace(`Searching for spinner...`);

            await this.bot.waitForElement(ELEMENTS.Icons.Spinner, SHORT_TIME);

            logger.trace(`Spinner found`);

            return true;
        } catch {
            logger.warn(`Spinner not found.`);

            return false;
        }
    }
}

export default Page;