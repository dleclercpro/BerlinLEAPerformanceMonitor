import { KNOWN_EVENTS } from '../config/events';
import { ERROR_PALETTE, WEEKDAY_PALETTE } from '../config/styles';
import { Weekday } from '../types';

export const getWeekdayColor = (weekday: Weekday) => {
    if (WEEKDAY_PALETTE.length < 7) throw new Error('Not enough colors in weekday palette.');
    
    switch (weekday) {
        case Weekday.Monday:
            return WEEKDAY_PALETTE[0];
        case Weekday.Tuesday:
            return WEEKDAY_PALETTE[1];
        case Weekday.Wednesday:
            return WEEKDAY_PALETTE[2];
        case Weekday.Thursday:
            return WEEKDAY_PALETTE[3];
        case Weekday.Friday:
            return WEEKDAY_PALETTE[4];
        case Weekday.Saturday:
            return WEEKDAY_PALETTE[5];
        case Weekday.Sunday:
            return WEEKDAY_PALETTE[6];
    }
}

export const getErrorColor = (err: string) => {
    if (ERROR_PALETTE.length < KNOWN_EVENTS.length) throw new Error('Not enough colors in error palette.');
    
    const index = KNOWN_EVENTS.findIndex(event => event === err);

    if (!index) throw new Error(`No color for error: ${err}`);

    return ERROR_PALETTE[index];
}