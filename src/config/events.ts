import { FoundNoAppointmentError, NoAppointmentInformationError, InternalServerError, GhostUIElementError, InfiniteSpinnerError, BrokenUIError, NoResultsError, ConstructionWorkError, ServiceUnavailableError, UndisclosedError } from '../models/errors';

export const KNOWN_BUGS = [
    NoAppointmentInformationError,
    NoResultsError,
    InternalServerError,
    ServiceUnavailableError,
    UndisclosedError,
    InfiniteSpinnerError,
    GhostUIElementError,
    BrokenUIError,
].map(err => err.name);

export const KNOWN_EVENTS = KNOWN_BUGS
    .concat([
        FoundNoAppointmentError,
        ConstructionWorkError,
    ].map(err => err.name));



export const SESSION_FAILURE_EVENTS = [
    FoundNoAppointmentError,
    NoAppointmentInformationError,
    NoResultsError,
    InfiniteSpinnerError,
    GhostUIElementError,
    BrokenUIError,
].map(err => err.name);