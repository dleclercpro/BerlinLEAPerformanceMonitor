import { KNOWN_UNEXPECTED_ERRORS } from '../config/errors';

export const isErrorKnown = (error: string) => {
    return KNOWN_UNEXPECTED_ERRORS
        .map(err => err.name)
        .includes(error);
};