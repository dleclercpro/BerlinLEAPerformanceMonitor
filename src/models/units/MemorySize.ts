import { Comparable, MemoryUnit } from '../../types';
import { round } from '../../utils/math';

class MemorySizeComparator {
    public static compare(a: MemorySize, b: MemorySize) {
        if (a.toBytes().getAmount() < b.toBytes().getAmount()) return -1;
        if (a.toBytes().getAmount() > b.toBytes().getAmount()) return 1;
        return 0;
    }
}



class MemorySize implements Comparable {
    private amount: number;
    private unit: MemoryUnit;

    public constructor(amount: number, unit: MemoryUnit) {
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

    public add(other: MemorySize) {
        return new MemorySize(this.toBytes().getAmount() + other.toBytes().getAmount(), MemoryUnit.Bytes);
    }

    public subtract(other: MemorySize) {
        return new MemorySize(this.toBytes().getAmount() - other.toBytes().getAmount(), MemoryUnit.Bytes);
    }

    public compare(other: MemorySize) {
        return MemorySizeComparator.compare(this, other);
    }

    public smallerThanOrEquals(other: MemorySize) {
        return this.smallerThan(other) || this.equals(other);
    }

    public smallerThan(other: MemorySize) {
        return this.compare(other) === -1;
    }

    public equals(other: MemorySize) {
        return this.compare(other) === 0;
    }

    public greaterThan(other: MemorySize) {
        return this.compare(other) === 1;
    }

    public greaterThanOrEquals(other: MemorySize) {
        return this.greaterThan(other) || this.equals(other);
    }

    public format() {
        const duration = this.toBytes();

        let amount = duration.getAmount();
        let unit = MemoryUnit.Bytes;
    
        // B -> KB
        if (amount >= 1_000) {
            amount /= 1_000;
            unit = MemoryUnit.Kilobytes;
    
            // KB -> MB
            if (amount >= 1_000) {
                amount /= 1_000;
                unit = MemoryUnit.Megabytes;
    
                // MG -> GB
                if (amount >= 1_000) {
                    amount /= 1_000;
                    unit = MemoryUnit.Gigabytes;
    
                    // GB -> TB
                    if (amount >= 1_000) {
                        amount /= 1_000;
                        unit = MemoryUnit.Terabytes;
                    }
                }
            }
        }
    
        return `${round(amount, 1)}${unit}`;
    }

    public to(unit: MemoryUnit) {
        let amount = 0;

        const bytes = this.toBytes().getAmount();
        
        switch (unit) {
            case MemoryUnit.Terabytes:
                amount = bytes / Math.pow(1_000, 4);
                break;
            case MemoryUnit.Gigabytes:
                amount = bytes / Math.pow(1_000, 3);
                break;
            case MemoryUnit.Megabytes:
                amount = bytes / Math.pow(1_000, 2);
                break;
            case MemoryUnit.Kilobytes:
                amount = bytes / Math.pow(1_000, 1);
                break;
            case MemoryUnit.Bytes:
                amount = bytes;
                break;
            default:
                throw new Error('Invalid memory unit.');
        }

        return new MemorySize(amount, unit); 
    }

    public toBytes() {
        let amount = 0;
        
        switch (this.unit) {
            case MemoryUnit.Terabytes:
                amount = this.amount * Math.pow(1_000, 4);
                break;
            case MemoryUnit.Gigabytes:
                amount = this.amount * Math.pow(1_000, 3);
                break;
            case MemoryUnit.Megabytes:
                amount = this.amount * Math.pow(1_000, 2);
                break;
            case MemoryUnit.Kilobytes:
                amount = this.amount * Math.pow(1_000, 1);
                break;
            case MemoryUnit.Bytes:
                amount = this.amount;
                break;
            default:
                throw new Error('Invalid memory unit.');
        }

        return new MemorySize(amount, MemoryUnit.Bytes);
    }
}

export default MemorySize;