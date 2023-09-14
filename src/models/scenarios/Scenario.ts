import logger from '../../logger';
import Bot from '../bots/Bot';

abstract class Scenario {
    protected abstract name: string;

    protected abstract doExecute(bot: Bot): Promise<void>;

    public async execute(bot: Bot) {
        logger.info(`--------------- Scenario: ${this.name} [START] ---------------`);

        await this.doExecute(bot);

        logger.info(`--------------- Scenario: ${this.name} [END] ---------------`);
    }
}

export default Scenario;