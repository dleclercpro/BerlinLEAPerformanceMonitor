import { NoAppointmentError, NoInformationError, InternalServerError, MissingElementError, InfiniteSpinnerError, DefectiveUIError, NoResultsError, ConstructionWorkError, ServiceUnavailableError, UndisclosedError } from '../errors';

export const KNOWN_BUGS = [
    NoInformationError,
    NoResultsError,
    InternalServerError,
    ServiceUnavailableError,
    UndisclosedError,
    InfiniteSpinnerError,
    MissingElementError,
    DefectiveUIError,
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
    MissingElementError,
    DefectiveUIError,
].map(err => err.name);