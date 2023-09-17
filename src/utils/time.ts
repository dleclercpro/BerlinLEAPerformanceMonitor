import { LOCALE } from '../config';
import logger from './logger';
import TimeDuration, { TimeUnit } from '../models/TimeDuration';
import { Locale, Weekday } from '../types';
import { WEEKDAYS } from '../constants';

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

export const getWeekday = (date: Date) => {
    return WEEKDAYS[date.getDay()] as Weekday;
}

export const translateWeekday = (weekday: Weekday, locale: Locale) => {
    const index = WEEKDAYS.indexOf(weekday);

    switch (locale) {
        case Locale.EN:
            return WEEKDAYS[index];
        case Locale.DE:
            return ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'][index];
    }
}

export const formatDateByLocale = (date: Date, locale: Locale) => {
    const weekday = getWeekday(date);

    switch (locale) {
        case Locale.EN:
            throw new Error('Not implemented yet.');
        case Locale.DE:
            return `${translateWeekday(weekday, locale)}, den ${date.toLocaleString(locale).replace(', ', ' um ')}`;
        }
}

export const formatDate = (date: Date) => {
    return formatDateByLocale(date, LOCALE);
}