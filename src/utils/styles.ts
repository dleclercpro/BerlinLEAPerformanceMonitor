import { KNOWN_EVENTS } from '../config/events';
import { EVENT_PALETTE, WEEKDAY_PALETTE } from '../config/styles';
import { WEEKDAYS } from '../constants/times';
import { Weekday } from '../types';

export const getWeekdayColor = (weekday: Weekday) => {
    if (WEEKDAY_PALETTE.length < 7) throw new Error('Not enough colors in weekday palette.');
    
    return WEEKDAY_PALETTE[WEEKDAYS.findIndex(day => day === weekday)];
}

export const getEventColor = (event: string) => {
    if (EVENT_PALETTE.length < KNOWN_EVENTS.length) throw new Error('Not enough colors in event palette.');
    
    const index = KNOWN_EVENTS.findIndex(knownEvent => knownEvent === event);

    if (!index) throw new Error(`No color for event: ${event}`);

    return EVENT_PALETTE[index];
}