import { LogMessages } from '../../constants';
import { KNOWN_ERRORS } from '../../config';
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
            if (KNOWN_ERRORS.map(e => e.name).includes(err.name)) {
                logger.error({ err: err.name }, LogMessages.ExpectedError);
            } else {
                logger.fatal({ err: err.name }, LogMessages.UnknownError);
            }
            
            throw err;

        } finally {
            logger.info(`--------------- Scenario: ${this.name} [END] ---------------`);
        }
    }
}

export default Scenario;