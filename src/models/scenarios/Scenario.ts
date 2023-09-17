import { EXPECTED_ERRORS, EXPECTED_ERROR_MESSAGE, UNKNOWN_ERROR_MESSAGE } from '../../errors';
import logger from '../../logger';
import Bot from '../bots/Bot';

abstract class Scenario {
    protected abstract name: string;

    protected abstract doExecute(bot: Bot): Promise<void>;

    public async execute(bot: Bot) {
        try {
            logger.info(`--------------- Scenario: ${this.name} [START] ---------------`);

            await this.doExecute(bot);

        } catch (err: any) {
            if (EXPECTED_ERRORS.map(e => e.name).includes(err.name)) {
                logger.error({ err: err.name }, EXPECTED_ERROR_MESSAGE);
            } else {
                logger.fatal({ err: err.name }, UNKNOWN_ERROR_MESSAGE);
            }
            
            throw err;

        } finally {
            logger.info(`--------------- Scenario: ${this.name} [END] ---------------`);
        }
    }
}

export default Scenario;