import logger from '../logger';
import TimeDuration from '../models/TimeDuration';
import { TimeUnit } from '../types';

export const sleep = async (duration: TimeDuration) => {
    logger.trace(`Sleep... (${duration.format()})`);

    const ms = duration.toMs().getAmount();

    await new Promise(resolve => setTimeout(resolve, ms));

    logger.trace(`Woke up.`);
};

export const getTimeSpentSinceMidnight = (date: Date) => {
    const midnight = new Date(date);
    midnight.setHours(0, 0, 0, 0);

    return new TimeDuration(date.getTime() - midnight.getTime(), TimeUnit.Milliseconds);
}

export const computeDate = (date: Date, diff: TimeDuration) => {
    return new Date(date.getTime() + diff.toMs().getAmount());
}