export const round = (x: number, decimals: number) => {
    const pow = Math.pow(10, decimals)

    return Math.round(x * pow) / pow;
}

export const sum = (arr: number[]) => {
    return arr.reduce((count, x) => count + x, 0);
}

export const getAverage = (arr: number[]) => {
    return sum(arr) / arr.length;
}

export const getRange = (size: number) => {
    return [...Array(size).keys()];
}