import { Comparable } from '../types';

class ReleaseComparator {
    public static compare(a: Release, b: Release) {
        if (a.getMajor() > b.getMajor()) {
            return 1;
        }

        if (a.getMajor() === b.getMajor()) {
            if (a.getMinor() > b.getMinor()) {
                return 1;
            }

            if (a.getMinor() === b.getMinor()) {
                if (a.getPatch() > b.getPatch()) {
                    return 1;
                }

                if (a.getPatch() === b.getPatch()) {
                    return 0;
                }
            }
        }

        return -1;
    }
}



class Release implements Comparable {
    protected major: number;
    protected minor: number;
    protected patch: number;

    public constructor(major: number, minor: number, patch: number) {
        this.major = major;
        this.minor = minor;
        this.patch = patch;
    }

    public static fromString(version: string) {
        const parts = version.split('.');
        const [major, minor, patch] = parts.map(v => Number(v));

        if (parts.length !== 3 || [major, minor, patch].some(v => Number.isNaN(v))) {
            throw new Error(`Invalid release format: ${version}`);
        }

        return new Release(major, minor, patch);
    }

    public toString() {
        return `${this.major}.${this.minor}.${this.patch}`;
    }

    public toJSON() {
        return {
            major: this.major,
            minor: this.minor,
            patch: this.patch,
        };
    }

    public getMajor() {
        return this.major;
    }

    public getMinor() {
        return this.minor;
    }

    public getPatch() {
        return this.patch;
    }

    public compare(other: Release) {
        return ReleaseComparator.compare(this, other);
    }

    public smallerThanOrEquals(other: Release) {
        return this.smallerThan(other) || this.equals(other);
    }

    public smallerThan(other: Release) {
        return this.compare(other) === -1;
    }

    public equals(other: Release) {
        return this.compare(other) === 0;
    }

    public greaterThan(other: Release) {
        return this.compare(other) === 1;
    }

    public greaterThanOrEquals(other: Release) {
        return this.greaterThan(other) || this.equals(other);
    }
}

export default Release;