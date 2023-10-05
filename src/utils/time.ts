import logger from '../logger';
import TimeDuration from '../models/units/TimeDuration';
import { TimeUnit } from '../types';

export const sleep = async (duration: TimeDuration) => {
    logger.trace(`Sleep... (${duration.format()})`);

    const ms = duration.toMs().getAmount();

    await new Promise(resolve => setTimeout(resolve, ms));

    logger.trace(`Woke up.`);
};

export const getMidnightInUTC = (date: Date) => {
    const midnight = new Date(date);
    midnight.setUTCHours(0, 0, 0, 0); // In UTC time zone

    return midnight;
}

export const getMidnight = (date: Date) => {
    const midnight = new Date(date);
    midnight.setHours(0, 0, 0, 0); // In local time zone

    return midnight;
}

export const getTimeSpentSinceMidnight = (date: Date) => {
    const midnight = getMidnight(date);

    return new TimeDuration(date.getTime() - midnight.getTime(), TimeUnit.Milliseconds);
}

export const computeDate = (date: Date, diff: TimeDuration) => {
    return new Date(date.getTime() + diff.toMs().getAmount());
}