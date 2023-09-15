export class TimeoutError extends Error {
    public name = 'TimeoutError';
}

export class AggregateError extends Error {
    public name = 'AggregateError';
}

export class UnexpectedAlertOpenError extends Error {
    public name = 'UnexpectedAlertOpenError';
}



// Custom errors
export class NoAppointmentsError extends Error {
    public name = 'NoAppointmentsError';
}

export class InternalServerError extends Error {
    public name = 'InternalServerError';
}

export class ElementMissingFromPageError extends Error {
    public name = 'ElementMissingFromPageError';
}

export class InfiniteSpinnerError extends Error {
    public name = 'InfiniteSpinnerError';
}

export class UIError extends Error {
    public name = 'UIError';
}



export const EXPECTED_ERRORS = [
    NoAppointmentsError,
    InternalServerError,
    ElementMissingFromPageError,
    InfiniteSpinnerError,
    UIError,
];

export const UNKNOWN_ERROR_MESSAGE = 'An unknown error occurred.';
export const EXPECTED_ERROR_MESSAGE = 'An expected error occured.';