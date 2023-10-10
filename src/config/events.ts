import BrokenUIError from '../models/errors/BrokenUIError';
import ConstructionWorkError from '../models/errors/ConstructionWorkError';
import FoundNoAppointmentError from '../models/errors/FoundNoAppointmentError';
import GhostUIElementError from '../models/errors/GhostUIElementError';
import InfiniteSpinnerError from '../models/errors/InfiniteSpinnerError';
import InternalServerError from '../models/errors/InternalServerError';
import NoAppointmentInformationError from '../models/errors/NoAppointmentInformationError';
import NoResultsError from '../models/errors/NoResultsError';
import ServiceUnavailableError from '../models/errors/ServiceUnavailableError';
import UndisclosedError from '../models/errors/UndisclosedError';

export const KNOWN_BUGS = [
    NoAppointmentInformationError,
    NoResultsError,
    InternalServerError,
    ServiceUnavailableError,
    UndisclosedError,
    InfiniteSpinnerError,
    GhostUIElementError,
    BrokenUIError,
].map(err => err.name);

export const KNOWN_EVENTS = KNOWN_BUGS
    .concat([
        FoundNoAppointmentError,
        ConstructionWorkError,
    ].map(err => err.name));



// Events that can be understood as a failure to find an appointment
export const FAILURE_EVENTS = [
    FoundNoAppointmentError,
    NoAppointmentInformationError,
    NoResultsError,
    InfiniteSpinnerError,
    GhostUIElementError,
    BrokenUIError,
].map(err => err.name);