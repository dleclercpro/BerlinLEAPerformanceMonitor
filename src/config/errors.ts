import { NoAppointmentsError, NoInformationError, InternalServerError, MissingElementError, InfiniteSpinnerError, UIError, NoResultsError, ConstructionWorkError } from '../errors';

export const NO_APPOINTMENT_ERRORS = [
    NoAppointmentsError,
    NoInformationError,
    NoResultsError,
    InfiniteSpinnerError,
    MissingElementError,
    UIError,
].map(err => err.name);

export const KNOWN_UNEXPECTED_ERRORS = [
    NoInformationError,
    ConstructionWorkError,
    NoResultsError,
    InternalServerError,
    MissingElementError,
    InfiniteSpinnerError,
    UIError,
].map(err => err.name);

export const KNOWN_ERRORS = [
    ...KNOWN_UNEXPECTED_ERRORS,
    ...[NoAppointmentsError].map(err => err.name),
];