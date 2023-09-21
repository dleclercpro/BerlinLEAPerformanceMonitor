import { KNOWN_ERRORS, KNOWN_UNEXPECTED_ERRORS } from '../config/errors';

export const isErrorKnown = (error: string) => {
    return KNOWN_ERRORS
        .map(err => err.name)
        .includes(error);
};

export const isErrorKnownYetUnexpected = (error: string) => {
    return KNOWN_UNEXPECTED_ERRORS
        .map(err => err.name)
        .includes(error);
};