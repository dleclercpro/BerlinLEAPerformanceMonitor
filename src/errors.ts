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

export class NoInformationError extends Error {
    public name = 'NoInformationError';
}

export class ConstructionWorkError extends Error {
    public name = 'ConstructionWorkError';
}

export class BackToFindAppointmentPageError extends Error {
    public name = 'BackToFindAppointmentPageError';
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