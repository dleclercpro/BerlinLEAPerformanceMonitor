export const round = (x: number, decimals: number) => {
    const pow = Math.pow(10, decimals)

    return Math.round(x * pow) / pow;
}

export const sum = (arr: number[]) => {
    return arr.reduce((count, x) => count + x, 0);
}

export const getRange = (from: number, to?: number) => {
    let size;

    if (to === undefined) {
        size = from;
    } else {
        if (from >= to) {
            throw new Error(`'From' must be smaller than 'to'.`);
        }

        size = (to - from) + 1;
    }

    return [...Array(size).keys()]
        .map(x => x + from);
}

export const getCountsDict = (arr: string[]) => {
    const dict: Record<string, number> = {};

    arr.forEach(el => {
        const count = dict[el] ?? 0;

        dict[el] = count + 1;
    });

    return dict;
}