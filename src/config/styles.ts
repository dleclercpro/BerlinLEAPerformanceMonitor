import { PALETTE_HLS_12, PALETTE_ROCKET_7 } from '../constants/styles';
import { Size } from '../types';

export const ERROR_PALETTE = PALETTE_HLS_12;
export const WEEKDAY_PALETTE = PALETTE_ROCKET_7;

export const DEVICE_PIXEL_RATIO: number = 4; // Better image resolution for graphs
export const DEFAULT_GRAPH_SIZE: Size = {
    width: 1024, // px
    height: 728, // px
};