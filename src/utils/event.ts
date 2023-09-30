import { KNOWN_EVENTS, KNOWN_BUGS, FAILURE_EVENTS } from '../config/events';

export const isKnownEvent = (event: string) => {
    return KNOWN_EVENTS.includes(event);
};

export const isKnownBug = (bug: string) => {
    return KNOWN_BUGS.includes(bug);
}

export const isFailureEvent = (event: string) => {
    return FAILURE_EVENTS.includes(event);
}