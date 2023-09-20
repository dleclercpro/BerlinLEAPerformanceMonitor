import { Locale, Weekday } from '../types';
import { WEEKDAYS } from '../constants/times';
import { LOCALE } from '../config/LocaleConfig';

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

export const formatDateByLocale = (date: Date, locale: Locale, options?: Intl.DateTimeFormatOptions) => {
    return date.toLocaleString(locale, options);
}

export const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions) => {
    return formatDateByLocale(date, LOCALE, options);
}

export const formatDateForFilename = (date: Date) => {
    const yy = date.getFullYear();
    const mm = (date.getMonth() + 1);
    const dd = date.getDate();
    const h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();

    const year = yy.toString();
    const [month, day, hours, minutes, seconds] = [mm, dd, h, m, s].map(x => x.toString().padStart(2, '0'));

    return `${year}.${month}.${day} - ${hours}.${minutes}.${seconds}`;
}