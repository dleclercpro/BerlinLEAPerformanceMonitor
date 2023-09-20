import { Locale } from '../types';

export const LOCALE = Locale.DE;
export const LONG_DATE_TIME_FORMAT_OPTIONS = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
} as Intl.DateTimeFormatOptions;