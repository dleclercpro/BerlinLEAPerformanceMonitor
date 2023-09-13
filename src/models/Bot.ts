import logger from '../logger';

class Bot {
    protected url: string;

    public constructor(url: string) {
        this.url = url;

        logger.info(`Setting bot URL to: ${url}`);
    }

    public getUrl() {
        return this.url;
    }
}

export default Bot;