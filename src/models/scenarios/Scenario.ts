import logger from '../../logger';
import Bot from '../Bot';

abstract class Scenario {
    protected abstract name: string;

    protected abstract doExecute(bot: Bot): Promise<void>;

    public async execute(bot: Bot) {
        logger.info(`Executing scenario: ${this.name}`);

        await this.doExecute(bot);
    }
}

export default Scenario;