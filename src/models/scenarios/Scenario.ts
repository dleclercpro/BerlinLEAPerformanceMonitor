import { LogMessage } from '../../constants';
import logger from '../../logger';
import { isKnownEvent } from '../../utils/event';
import Bot from '../bots/Bot';

abstract class Scenario {
    protected name: string = this.constructor.name;

    protected abstract doExecute(bot: Bot): Promise<void>;

    public async execute(bot: Bot) {
        try {
            logger.info(`--------------- Scenario: ${this.name} [START] ---------------`);

            await this.doExecute(bot);

        } catch (err: unknown) {
            let error = err;

            if (err instanceof Error) {
                if (isKnownEvent(err.name)) {
                    logger.error({ err: err.name }, LogMessage.KnownEvent);
                } else {
                    logger.fatal({ err: err.name, msg: err.message }, LogMessage.UnknownEvent);
                }
            } else {
                logger.warn(err, `Unexpected error thrown!`);
            }
            
            throw error;

        } finally {
            logger.info(`--------------- Scenario: ${this.name} [END] ---------------`);
        }
    }
}

export default Scenario;