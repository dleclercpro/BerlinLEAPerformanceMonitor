import { PALETTE_HLS_8_CUSTOM, PALETTE_MAGMA } from '../constants/styles';
import { Size } from '../types';

export const ERROR_COLORS = PALETTE_HLS_8_CUSTOM;
export const WEEKDAY_COLORS = PALETTE_MAGMA;

export const DEVICE_PIXEL_RATIO: number = 4; // Better image resolution for graphs
export const DEFAULT_GRAPH_SIZE: Size = {
    width: 1024, // px
    height: 728, // px
};