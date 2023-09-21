import { LogMessage } from '../../constants';
import logger from '../../logger';
import { isErrorKnown } from '../../utils/errors';
import Bot from '../bots/Bot';

abstract class Scenario {
    protected abstract name: string;

    protected abstract doExecute(bot: Bot): Promise<void>;

    public async execute(bot: Bot) {
        try {
            logger.info(`--------------- Scenario: ${this.name} [START] ---------------`);

            await this.doExecute(bot);

        } catch (err: any) {
            if (isErrorKnown(err.name)) {
                logger.error({ err: err.name }, LogMessage.KnownError);
            } else {
                logger.fatal({ err: err.name, msg: err.message }, LogMessage.UnknownError);
            }
            
            throw err;

        } finally {
            logger.info(`--------------- Scenario: ${this.name} [END] ---------------`);
        }
    }
}

export default Scenario;