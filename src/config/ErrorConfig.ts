import { NoAppointmentsError, NoInformationError, InternalServerError, ElementMissingFromPageError, InfiniteSpinnerError, UIError, BackToFindAppointmentPageError, ConstructionWorkError } from '../errors';

export const KNOWN_UNEXPECTED_ERRORS = [
    NoInformationError,
    ConstructionWorkError,
    BackToFindAppointmentPageError,
    InternalServerError,
    ElementMissingFromPageError,
    InfiniteSpinnerError,
    UIError,
];

export const KNOWN_ERRORS = [
    ...KNOWN_UNEXPECTED_ERRORS,
    NoAppointmentsError,
];