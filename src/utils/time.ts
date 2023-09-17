import { LOCALE } from '../config';
import logger from './logging';
import TimeDuration from '../models/TimeDuration';
import { Locale, Weekday } from '../types';

export const sleep = async (duration: TimeDuration) => {
    logger.trace(`Sleep... (${duration.format()})`);

    const ms = duration.toMs().getAmount();

    await new Promise(resolve => setTimeout(resolve, ms));

    logger.trace(`Woke up.`);
};

export const getWeekdaysByLocale = (locale: Locale) => {
    switch (locale) {
        case Locale.EN:
            return [Weekday.Sunday, Weekday.Monday, Weekday.Thursday, Weekday.Wednesday, Weekday.Thursday, Weekday.Friday, Weekday.Saturday];
        case Locale.DE:
            return ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    }
}

export const getWeekdayByLocale = (date: Date, locale: Locale) => {
    return getWeekdaysByLocale(locale)[date.getDay()];
}

export const getWeekday = (date: Date) => {
    return getWeekdayByLocale(date, LOCALE);
}

export const formatDateByLocale = (date: Date, locale: Locale) => {
    switch (locale) {
        case Locale.EN:
            throw new Error('Not implemented yet.');
        case Locale.DE:
            return `${getWeekdayByLocale(date, locale)}, den ${date.toLocaleString(locale).replace(', ', ' um ')}`;
        }
}

export const formatDate = (date: Date) => {
    return formatDateByLocale(date, LOCALE);
}