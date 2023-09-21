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
export class NotEnoughDataError extends Error {
    public name = 'NotEnoughDataError';
}

export class JobSchedulerError extends Error {
    public name = 'JobSchedulerError';
}

export class NoAppointmentsError extends Error {
    public name = 'NoAppointmentsError';
}

export class NoInformationError extends Error {
    public name = 'NoInformationError';
}

export class ConstructionWorkError extends Error {
    public name = 'ConstructionWorkError';
}

export class NoResultsError extends Error {
    public name = 'NoResultsError';
}

export class InternalServerError extends Error {
    public name = 'InternalServerError';
}

export class ServiceUnavailableError extends Error {
    public name = 'ServiceUnavailableError';
}

export class MissingElementError extends Error {
    public name = 'MissingElementError';
}

export class InfiniteSpinnerError extends Error {
    public name = 'InfiniteSpinnerError';
}

export class UIError extends Error {
    public name = 'UIError';
}