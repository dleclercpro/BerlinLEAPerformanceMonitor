import { round } from '../../utils/math';

export enum MemoryUnit {
    Bytes = 'B',
    Kilobytes = 'KB',
    Megabytes = 'MB',
    Gigabytes = 'GB',
}

class MemorySize {
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

    public format() {
        const size = this.toBytes();

        let amount = size.getAmount();
        let unit = MemoryUnit.Bytes;
    
        // B -> KB
        if (amount >= 1_000) {
            amount /= 1_000;
            unit = MemoryUnit.Kilobytes;
    
            // KB -> MB
            if (amount >= 1_000) {
                amount /= 1_000;
                unit = MemoryUnit.Megabytes;
    
                // MB -> GB
                if (amount >= 1_000) {
                    amount /= 1_000;
                    unit = MemoryUnit.Gigabytes;
                }
            }
        }
    
        return `~${round(amount, 1)}${unit}`;
    }

    public toBytes() {
        let amount = 0;
        
        switch (this.unit) {
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

    public add(other: MemorySize) {
        return new MemorySize(this.toBytes().getAmount() + other.toBytes().getAmount(), MemoryUnit.Bytes);
    }

    public subtract(other: MemorySize) {
        return new MemorySize(this.toBytes().getAmount() - other.toBytes().getAmount(), MemoryUnit.Bytes);
    }
}

export default MemorySize;