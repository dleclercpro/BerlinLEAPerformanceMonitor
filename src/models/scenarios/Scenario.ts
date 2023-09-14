import { EXPECTED_ERRORS } from '../../errors';
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
                logger.error({ err: err.name }, `Expected error encountered:`);
            } else {
                logger.fatal(err, `An unknown error occurred!`);
            }
            
            throw err;

        } finally {
            logger.info(`--------------- Scenario: ${this.name} [END] ---------------`);
        }
    }
}

export default Scenario;