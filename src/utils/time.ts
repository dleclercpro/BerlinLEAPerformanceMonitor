import { LOCALE } from '../config';
import logger from '../logger';
import TimeDuration from '../models/TimeDuration';

const WEEKDAYS = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

export const sleep = async (duration: TimeDuration) => {
    logger.trace(`Sleep... (${duration.format()})`);

    const ms = duration.toMs().getAmount();

    await new Promise(resolve => setTimeout(resolve, ms));

    logger.trace(`Woke up.`);
};

export const getWeekday = (date: Date) => {
    return WEEKDAYS[date.getDay()];
}

export const formatDate = (date: Date, locale: string = LOCALE) => {
    switch (locale) {
        case 'de':
            return `${getWeekday(date)}, den ${date.toLocaleString('de').replace(', ', ' um ')}`;
        }
}