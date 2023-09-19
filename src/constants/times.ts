import TimeDuration from '../models/TimeDuration';
import { TimeUnit, Weekday } from '../types';

export const WEEKDAYS = Object.values(Weekday);
export const WORKDAYS = [Weekday.Monday, Weekday.Tuesday, Weekday.Wednesday, Weekday.Thursday, Weekday.Friday];

export const FIVE_MINUTES = new TimeDuration(5, TimeUnit.Minutes);
export const TEN_MINUTES = new TimeDuration(10, TimeUnit.Minutes);
export const ONE_HOUR = new TimeDuration(1, TimeUnit.Hours);
export const ONE_DAY = new TimeDuration(1, TimeUnit.Days);

export const NO_TIME = new TimeDuration(0, TimeUnit.Milliseconds);
export const VERY_SHORT_TIME = new TimeDuration(1, TimeUnit.Seconds);
export const SHORT_TIME = new TimeDuration(2, TimeUnit.Seconds);
export const MEDIUM_TIME = new TimeDuration(5, TimeUnit.Seconds);
export const LONG_TIME = new TimeDuration(10, TimeUnit.Seconds);
export const VERY_LONG_TIME = new TimeDuration(30, TimeUnit.Seconds);
export const VERY_VERY_LONG_TIME = new TimeDuration(1, TimeUnit.Minutes);
export const INFINITE_TIME = new TimeDuration(2, TimeUnit.Minutes); // More than 2 minutes in Internet terms is an eternity...