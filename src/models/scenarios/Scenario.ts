import logger from '../../logger';
import Bot from '../bots/Bot';

abstract class Scenario {
    protected bot?: Bot;

    protected abstract name: string;

    protected abstract doExecute(bot: Bot): Promise<void>;

    public async execute(bot: Bot) {
        logger.info(`Executing scenario: ${this.name}`);

        this.bot = bot;

        await this.doExecute(bot);

        this.bot = undefined;
    }
}

export default Scenario;