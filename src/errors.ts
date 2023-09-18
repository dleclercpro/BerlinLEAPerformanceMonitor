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

export class NoInformationError extends Error {
    public name = 'NoInformationError';
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
    NoInformationError,
    InternalServerError,
    ElementMissingFromPageError,
    InfiniteSpinnerError,
    UIError,
];