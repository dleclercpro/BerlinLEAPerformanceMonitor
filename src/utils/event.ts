import { KNOWN_EVENTS, KNOWN_BUGS, FAILURE_EVENTS } from '../config/events';
import { Event } from '../types';

export const isKnownEvent = (event: Event) => {
    return KNOWN_EVENTS.map(e => e.id).includes(event.id);
};

export const isKnownBug = (event: Event) => {
    return KNOWN_BUGS.map(e => e.id).includes(event.id);
}

export const isFailureEvent = (event: Event) => {
    return FAILURE_EVENTS.map(e => e.id).includes(event.id);
}