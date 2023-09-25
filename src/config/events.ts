import { NoAppointmentError, NoInformationError, InternalServerError, GhostUIElement, InfiniteSpinnerError, BrokenUIError, NoResultsError, ConstructionWorkError, ServiceUnavailableError, UndisclosedError } from '../errors';

export const KNOWN_BUGS = [
    NoInformationError,
    NoResultsError,
    InternalServerError,
    ServiceUnavailableError,
    UndisclosedError,
    InfiniteSpinnerError,
    GhostUIElement,
    BrokenUIError,
].map(err => err.name);

export const KNOWN_EVENTS = KNOWN_BUGS
    .concat([
        NoAppointmentError,
        ConstructionWorkError,
    ].map(err => err.name));



export const SESSION_FAILURE_EVENTS = [
    NoAppointmentError,
    NoInformationError,
    NoResultsError,
    InfiniteSpinnerError,
    GhostUIElement,
    BrokenUIError,
].map(err => err.name);