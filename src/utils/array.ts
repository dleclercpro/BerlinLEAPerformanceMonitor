import { getRange } from './math';

export const getRandom = <V> (arr: V[]) => {
    return arr[Math.floor(Math.random() * arr.length)];
}

export const getFirstValue = <V> (arr: V[]) => {
    if (arr.length > 0) return arr[0];
}

export const getLastValue = <V> (arr: V[]) => {
    if (arr.length > 0) return arr[arr.length - 1];
}

export const flatten = <V> (arr: V[][]) => {
    return arr.reduce((prevValues, values) => {
        return [...prevValues, ...values];
    }, []);
}

export const unique =<V> (arr: V[]) => {
    return [...new Set(arr)];
}

export const toCountsFromArray = (arr: string[]) => {
    const counts: Record<string, number> = {};

    arr.forEach(el => {
        const count = counts[el] ?? 0;

        counts[el] = count + 1;
    });

    return counts;
}

export const fromCountsToArray = (counts: Record<string, number>) => {
    const errors = Object.keys(counts);

    return errors.reduce((prevErrors: string[], error: string) => {
        const errorCount = counts[error];

        return [...prevErrors, ...getRange(errorCount).map(() => error)];
    }, []);
}

export const generateEmptyCounts = (arr: string[]) => {
    return unique(arr)
        .reduce((prevValues, value) => {
            return {
                ...prevValues,
                [value]: 0,
            };
        }, {});
}