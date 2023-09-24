import { Event, EventType } from '../types';

export const FOUND_APPOINTMENT_EVENT: Event = {
    id: 'FoundAppointment',
    type: EventType.Success,
};



export const NO_APPOINTMENT_FOUND_EVENT: Event = {
    id: 'NoAppointmentFound',
    type: EventType.Normal,
};

export const CONSTRUCTION_WORK_EVENT: Event = {
    id: 'ConstructionWork',
    type: EventType.Normal,
};



export const NO_INFORMATION_BUG: Event = {
    id: 'NoInformationBug',
    type: EventType.Bug,
};

export const NO_RESULTS_BUG: Event = {
    id: 'NoResultsBug',
    type: EventType.Bug,
};

export const INTERNAL_SERVER_ERROR_BUG: Event = {
    id: 'InternalServerErrorBug',
    type: EventType.Bug,
};

export const SERVICE_UNAVAILABLE_BUG: Event = {
    id: 'ServiceUnavailableBug',
    type: EventType.Bug,
};

export const UNDISCLOSED_ERROR_BUG: Event = {
    id: 'UndisclosedErrorBug',
    type: EventType.Bug,
};

export const INFINITE_SPINNER_BUG: Event = {
    id: 'InfiniteSpinnerBug',
    type: EventType.Bug,
};

export const DEFECTIVE_UI_BUG: Event = {
    id: 'DefectiveUIBug',
    type: EventType.Bug,
};

export const MISSING_ELEMENT_BUG: Event = {
    id: 'MissingElementBug',
    type: EventType.Bug,
};