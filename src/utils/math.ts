export const round = (x: number, decimals: number) => {
    const pow = Math.pow(10, decimals)

    return Math.round(x * pow) / pow;
}

export const sum = (arr: number[]) => {
    return arr.reduce((count, x) => count + x, 0);
}

export const getRange = (size: number) => {
    return [...Array(size).keys()];
}

export const getCountsDict = (arr: string[]) => {
    const dict: Record<string, number> = {};

    arr.forEach(el => {
        const count = dict[el] ?? 0;

        dict[el] = count + 1;
    });

    return dict;
}