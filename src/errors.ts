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
export class FoundNoAppointmentError extends Error {
    public name = 'FoundNoAppointmentError';
}

export class NoResultsError extends Error {
    public name = 'NoResultsError';
}

export class NoAppointmentInformationError extends Error {
    public name = 'NoAppointmentInformationError';
}

export class InternalServerError extends Error {
    public name = 'InternalServerError';
}

export class ServiceUnavailableError extends Error {
    public name = 'ServiceUnavailableError';
}

export class UndisclosedError extends Error {
    public name = 'UndisclosedError';
}

export class ConstructionWorkError extends Error {
    public name = 'ConstructionWorkError';
}

export class InfiniteSpinnerError extends Error {
    public name = 'InfiniteSpinnerError';
}

export class BrokenUIError extends Error {
    public name = 'BrokenUIError';
}

export class GhostUIElement extends Error {
    public name = 'GhostUIElement';
}

export class ResultsPageDoesNotLoad extends Error {
    public name = 'ResultsPageDoesNotLoad';
}