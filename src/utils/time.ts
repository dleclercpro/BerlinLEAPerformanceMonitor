import logger from '../logger';
import TimeDuration from '../models/TimeDuration';

export const sleep = async (duration: TimeDuration) => {
    logger.trace(`Sleeping for: ${duration.format()}`);

    const ms = duration.toMs().getAmount();

    await new Promise(resolve => setTimeout(resolve, ms));

    logger.trace(`Woke up.`);
};