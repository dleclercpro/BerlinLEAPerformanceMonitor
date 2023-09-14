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
export class NoAppointmentError extends Error {
    public name = 'NoAppointmentError';
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
    NoAppointmentError,
    InternalServerError,
    ElementMissingFromPageError,
    InfiniteSpinnerError,
    UIError,
];