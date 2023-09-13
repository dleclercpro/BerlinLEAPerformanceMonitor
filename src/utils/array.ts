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

export const getRandom = (arr: any[]) => {
    return arr[Math.floor(Math.random() * arr.length)];
}

export const getLast = (arr: any[]) => {
    return arr[arr.length - 1];
}