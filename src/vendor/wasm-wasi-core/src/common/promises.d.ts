export interface CapturedPromise<T> {
    promise: Promise<T>;
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
}
export declare namespace CapturedPromise {
    function create<T>(): CapturedPromise<T>;
}
