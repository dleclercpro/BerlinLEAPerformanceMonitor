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
    public name = 'NoAppointments';
}

export class InternalServerError extends Error {
    public name = 'InternalServerError';
}

export class ElementMissingFromPageError extends Error {
    public name = 'ElementMissingFromPage';
}

export class InfiniteSpinnerError extends Error {
    public name = 'InfiniteSpinner';
}

export class PageStructureIntegrityError extends Error {
    public name = 'PageStructureIntegrity';
}