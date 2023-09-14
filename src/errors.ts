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