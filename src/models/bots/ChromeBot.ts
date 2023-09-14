import { Builder, Browser as SeleniumBrowser } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';
import Bot from './Bot';



const OPTIONS = new Options()
    .addArguments(`disable-blink-features=AutomationControlled`)
    .addArguments(`user-agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.53 Safari/537.36'`)
    .addArguments(`'log-level=3`)
    .excludeSwitches('enable-logging')



class ChromeBot extends Bot {
    protected name = SeleniumBrowser.CHROME;
    protected options = OPTIONS;

    protected async buildDriver() {
        this.driver = await new Builder()
            .forBrowser(this.name)
            .setChromeOptions(this.options)
            .build();
    }

    protected async prepareDriver() {
        if (!this.driver) throw new Error('Missing driver!');

        await this.driver.executeScript(`Object.defineProperty(navigator, 'webdriver', {get: () => undefined})`);
    }
}

export default ChromeBot;