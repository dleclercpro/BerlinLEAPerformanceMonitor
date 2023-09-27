import { FoundNoAppointmentError, NoAppointmentInformationError, InternalServerError, GhostUIElement, InfiniteSpinnerError, BrokenUIError, NoResultsError, ConstructionWorkError, ServiceUnavailableError, UndisclosedError, ResultsPageDoesNotLoad } from '../errors';

export const KNOWN_BUGS = [
    NoAppointmentInformationError,
    NoResultsError,
    InternalServerError,
    ServiceUnavailableError,
    UndisclosedError,
    InfiniteSpinnerError,
    GhostUIElement,
    BrokenUIError,
    ResultsPageDoesNotLoad,
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
    GhostUIElement,
    BrokenUIError,
    ResultsPageDoesNotLoad,
].map(err => err.name);