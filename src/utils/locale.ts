import { Locale, Weekday } from '../types';
import { WEEKDAYS } from '../constants/times';
import { LOCALE } from '../config/locale';

export const getTimeZone = () => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
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

export const formatNumberByLocale = (x: number, locale: Locale, options?: Intl.DateTimeFormatOptions) => {
    return x.toLocaleString(locale, options);
}

export const formatNumber = (x: number, options?: Intl.DateTimeFormatOptions) => {
    return formatNumberByLocale(x, LOCALE, options);
}

export const formatDateByLocale = (date: Date, locale: Locale, options?: Intl.DateTimeFormatOptions) => {
    return date.toLocaleString(locale, options);
}

export const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions) => {
    return formatDateByLocale(date, LOCALE, options);
}

export const formatDateForFilename = (date: Date, opts: { day: boolean, time: boolean } = { day: true, time: true }) => {
    const yy = date.getUTCFullYear();
    const mm = (date.getUTCMonth() + 1);
    const dd = date.getUTCDate();
    const h = date.getUTCHours();
    const m = date.getUTCMinutes();
    const s = date.getUTCSeconds();

    const year = yy.toString();
    const [month, day, hours, minutes, seconds] = [mm, dd, h, m, s].map(x => x.toString().padStart(2, '0'));

    const formattedDay = `${year}.${month}.${day}`;
    const formattedTime = `${hours}.${minutes}.${seconds}`;

    if (opts.day && opts.time) {
        return `${formattedDay}T${formattedTime}Z`;
    }
    if (opts.day && !opts.time) {
        return `${formattedDay}T00.00.00Z`;
    }
    throw new Error('Invalid time format for filename.');
}