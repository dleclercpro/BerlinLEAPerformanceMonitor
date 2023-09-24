import { NoAppointmentError, NoInformationError, InternalServerError, MissingElementError, InfiniteSpinnerError, UIError, NoResultsError, ConstructionWorkError, ServiceUnavailableError, UndisclosedError } from '../errors';

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

export const KNOWN_EVENTS = KNOWN_BUGS
    .concat([
        NoAppointmentError,
        ConstructionWorkError,
    ].map(err => err.name))
    .concat(['AppointmentFound']); // FIXME



export const SESSION_FAILURE_EVENTS = [
    NoAppointmentError,
    NoInformationError,
    NoResultsError,
    InfiniteSpinnerError,
    MissingElementError,
    UIError,
].map(err => err.name);