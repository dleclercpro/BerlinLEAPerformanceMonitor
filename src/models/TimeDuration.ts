import { round } from '../utils/math';

export enum TimeUnit {
    Days = 'D',
    Hours = 'h',
    Minutes = 'm',
    Seconds = 's',
    Milliseconds = 'ms',
}

class TimeDuration {
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
    
        return `~${round(amount, 1)}${unit}`;
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

    public add(other: TimeDuration) {
        return new TimeDuration(this.toMs().getAmount() + other.toMs().getAmount(), TimeUnit.Milliseconds);
    }

    public subtract(other: TimeDuration) {
        return new TimeDuration(this.toMs().getAmount() - other.toMs().getAmount(), TimeUnit.Milliseconds);
    }
}

export default TimeDuration;