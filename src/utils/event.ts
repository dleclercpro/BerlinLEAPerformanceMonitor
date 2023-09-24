import { KNOWN_EVENTS, KNOWN_BUGS, SESSION_FAILURE_EVENTS } from '../config/events';
import { Event } from '../types';

export const isKnownEvent = (event: Event) => {
    return KNOWN_EVENTS.map(e => e.id).includes(event.id);
};

export const isKnownBug = (event: Event) => {
    return KNOWN_BUGS.map(e => e.id).includes(event.id);
}

export const isSessionFailureEvent = (event: Event) => {
    return SESSION_FAILURE_EVENTS.map(e => e.id).includes(event.id);
}