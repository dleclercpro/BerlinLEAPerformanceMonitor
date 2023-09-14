export const getRandom = (arr: any[]) => {
    return arr[Math.floor(Math.random() * arr.length)];
}

export const getLast = (arr: any[]) => {
    return arr[arr.length - 1];
}