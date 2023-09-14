import logger from '../logger';
import TimeDuration from '../models/TimeDuration';

export const sleep = async (duration: TimeDuration) => {
    logger.trace(`Sleep... (${duration.format()})`);

    const ms = duration.toMs().getAmount();

    await new Promise(resolve => setTimeout(resolve, ms));

    logger.trace(`Woke up.`);
};