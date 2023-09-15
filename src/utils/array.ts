export const getRandom = <V> (arr: V[]) => {
    return arr[Math.floor(Math.random() * arr.length)];
}

export const getLast = <V> (arr: V[]) => {
    if (arr.length > 0) return arr[arr.length - 1];
}

export const unique =<V> (arr: V[]) => {
    return [...new Set(arr)];
}