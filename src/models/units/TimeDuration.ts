import { Comparable, TimeUnit } from '../../types';
import { round } from '../../utils/math';

class TimeDurationComparator {
    public static compare(a: TimeDuration, b: TimeDuration) {
        if (a.toMs().getAmount() < b.toMs().getAmount()) return -1;
        if (a.toMs().getAmount() > b.toMs().getAmount()) return 1;
        return 0;
    }
}



class TimeDuration implements Comparable {
    private amount: number;
    private unit: TimeUnit;

    public constructor(amount: number, unit: TimeUnit) {
        this.amount = amount;
        this.unit = unit;
    }

    public isZero() {
        return this.amount === 0;
    }

    public getAmount() {
        return this.amount;
    }

    public getUnit() {
        return this.unit;
    }

    public add(other: TimeDuration) {
        return new TimeDuration(this.toMs().getAmount() + other.toMs().getAmount(), TimeUnit.Milliseconds);
    }

    public subtract(other: TimeDuration) {
        return new TimeDuration(this.toMs().getAmount() - other.toMs().getAmount(), TimeUnit.Milliseconds);
    }

    public compare(other: TimeDuration) {
        return TimeDurationComparator.compare(this, other);
    }

    public smallerThanOrEquals(other: TimeDuration) {
        return this.smallerThan(other) || this.equals(other);
    }

    public smallerThan(other: TimeDuration) {
        return this.compare(other) === -1;
    }

    public equals(other: TimeDuration) {
        return this.compare(other) === 0;
    }

    public greaterThan(other: TimeDuration) {
        return this.compare(other) === 1;
    }

    public greaterThanOrEquals(other: TimeDuration) {
        return this.greaterThan(other) || this.equals(other);
    }

    public format() {
        const duration = this.toMs();

        let amount = duration.getAmount();
        let unit = TimeUnit.Milliseconds;
    
        // ms -> s
        if (amount >= 1_000) {
            amount /= 1_000;
            unit = TimeUnit.Seconds;
    
            // s -> m
            if (amount >= 60) {
                amount /= 60;
                unit = TimeUnit.Minutes;
    
                // m -> h
                if (amount >= 60) {
                    amount /= 60;
                    unit = TimeUnit.Hours;
    
                    // h -> d
                    if (amount >= 24) {
                        amount /= 24;
                        unit = TimeUnit.Days;
                    }
                }
            }
        }
    
        return `${round(amount, 1)}${unit}`;
    }

    public to(unit: TimeUnit) {
        let amount = 0;

        const ms = this.toMs().getAmount();
        
        switch (unit) {
            case TimeUnit.Days:
                amount = ms / 24 / 3_600 / 1_000;
                break;
            case TimeUnit.Hours:
                amount = ms / 3_600 / 1_000;
                break;
            case TimeUnit.Minutes:
                amount = ms / 60 / 1_000;
                break;
            case TimeUnit.Seconds:
                amount = ms / 1_000;
                break;
            case TimeUnit.Milliseconds:
                amount = ms;
                break;
            default:
                throw new Error('Invalid time unit.');
        }

        return new TimeDuration(amount, unit); 
    }

    public toMs() {
        let amount = 0;
        
        switch (this.unit) {
            case TimeUnit.Days:
                amount = this.amount * 24 * 3_600 * 1_000;
                break;
            case TimeUnit.Hours:
                amount = this.amount * 3_600 * 1_000;
                break;
            case TimeUnit.Minutes:
                amount = this.amount * 60 * 1_000;
                break;
            case TimeUnit.Seconds:
                amount = this.amount * 1_000;
                break;
            case TimeUnit.Milliseconds:
                amount = this.amount;
                break;
            default:
                throw new Error('Invalid time unit.');
        }

        return new TimeDuration(amount, TimeUnit.Milliseconds);
    }
}

export default TimeDuration;