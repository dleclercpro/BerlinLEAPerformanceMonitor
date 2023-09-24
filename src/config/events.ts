import { NoAppointmentsError, NoInformationError, InternalServerError, MissingElementError, InfiniteSpinnerError, UIError, NoResultsError, ConstructionWorkError, ServiceUnavailableError, UndisclosedError } from '../errors';

export const SESSION_FAILURE_EVENTS = [
    NoAppointmentsError,
    NoInformationError,
    NoResultsError,
    InfiniteSpinnerError,
    MissingElementError,
    UIError,
].map(err => err.name);

export const KNOWN_BUGS = [
    NoInformationError,
    NoResultsError,
    InternalServerError,
    ServiceUnavailableError,
    UndisclosedError,
    InfiniteSpinnerError,
    MissingElementError,
    UIError,
].map(err => err.name);

export const KNOWN_EVENTS = KNOWN_BUGS.concat([
    NoAppointmentsError,
    ConstructionWorkError,
].map(err => err.name));