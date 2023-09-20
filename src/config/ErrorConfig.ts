import { NoAppointmentsError, NoInformationError, InternalServerError, MissingElementError, InfiniteSpinnerError, UIError, NoResultsError, ConstructionWorkError } from '../errors';

export const KNOWN_UNEXPECTED_ERRORS = [
    NoInformationError,
    ConstructionWorkError,
    NoResultsError,
    InternalServerError,
    MissingElementError,
    InfiniteSpinnerError,
    UIError,
];

export const KNOWN_ERRORS = [
    ...KNOWN_UNEXPECTED_ERRORS,
    NoAppointmentsError,
];