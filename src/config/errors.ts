import { NoAppointmentsError, NoInformationError, InternalServerError, MissingElementError, InfiniteSpinnerError, UIError, NoResultsError, ConstructionWorkError } from '../errors';

export const CAN_BE_UNDERSTOOD_AS_NO_APPOINTMENT_AVAILABLE_ERRORS = [
    NoAppointmentsError,
    NoInformationError,
    NoResultsError,
    InfiniteSpinnerError,
    MissingElementError,
    UIError,
];

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