


class InsideError extends Error {}
class OutsideError extends Error {}
/**
export async function main1() {
    const getUser = async (id:number) => {
        if (id == 0) throw new InsideError("Inside Errir")
        if (id == 1) throw new OutsideError("Outside Error")
        return {x:1};
    }
    
    try {
        let user = await getUser(1);
        ...
        ...
        ...
        ...
        ...
        ...
    } catch (e) {
        console.log("error", e)
        return;
    }
}

export async function main2() {
    const getUser = async (id:number) => {
        if (id == 0) throw new InsideError("Inside Errir")
        if (id == 1) throw new OutsideError("Outside Error")
        return {x:1};
    }

    let user;
    try { user = await getUser(1); }
    catch (e) {
        console.log("error", e)
        return;
    }
        
    ...
    ...
    ...
    ...
    ...
    ...
}
export async function main3() {
    const getUser = async (id:number) => {
        if (id == 0) throw new InsideError("Inside Errir")
        if (id == 1) throw new OutsideError("Outside Error")
        return {x:1};
    }
    
    let res = await withAsyncErrorCatch(getUser(1), [InsideError, OutsideError])
    if (res.hasError("OutsideError")) {
        console.log("error", res.error.type)
        return;
    }
    let user = res.getData();
    ...
    ...
    ...
    ...
    ...
    ...
}

export async function main4() {
    const Wrapper = async () => {
        const getUser = async (id:number) => {
            if (id == 0) throw new InsideError("Inside Error")
            if (id == 1) throw new OutsideError("Outside Error")
            return {x:1};
        }
            
        let res = await withAsyncErrorCatch(getUser(1), [InsideError])
        if (res.hasError()) {
            console.log("Catching inside error", res.error.type)
            return;
        }
        let user = res.getData();
    }
    

    let res = await withAsyncErrorCatch(Wrapper())
    if (res.hasError()) {
        console.log("catching all other errors", res.error.type)
        return;
    }
    let user = res.getData();
}
 */



class CatchResponse<T> {
    error?: CatchResponseError
    data?: T
    constructor(error: CatchResponseError | undefined, data?: T) {
        this.error = error;
        this.data = data;
    }
    isSuccess(): this is { data: T } {
        if (this.error == undefined) return true;
        return false;
    }
    hasError(type?:string): this is { error: CatchResponseError } {
        if (this.error == undefined) return false;
        if (type == undefined && this.error != undefined) return true;
        if (this.error != undefined && type != undefined && this.error.type == type) return true;
        return false;
    }
    getData() {
        if (this.data == undefined) throw new Error("No data in the CatchResponse.getData")
        return this.data as T;
    }
}
class CatchResponseError extends Error {
    type:string = ""
}

export function withAsyncErrorCatch<T, E extends new (message?: string) => Error>(
    promise: Promise<T> | (()=>Promise<T>),
    errorTypes?:E[],
): Promise<CatchResponse<T>> {
    let _promise = promise;
    if (_promise instanceof Function) {
        _promise = _promise();
    }
    return _promise
        .then(res => {
            return new CatchResponse(undefined, res);
        })
        .catch((error) => {
            let e = new CatchResponseError(error);
            e.type = error.constructor.name
            if (errorTypes == undefined) return new CatchResponse(e);
            if (errorTypes.some(_e => error instanceof _e)) {
                return new CatchResponse(e);
            }
            throw error;
        })
}


export function withSyncErrorCatch<T, E extends new (message?: string) => Error>(
    promise: T | (()=>T),
    errorTypes?:E[],
): CatchResponse<T> {
    
    try {
        let _promise = promise;
        if (_promise instanceof Function) {
            _promise = _promise();
        }
        return new CatchResponse(undefined, _promise);
    } catch (error:any) {
        let e = new CatchResponseError(error);
        e.type = error.constructor.name
        if (errorTypes == undefined) return new CatchResponse(e);
        if (errorTypes.some(_e => error instanceof _e)) {
            return new CatchResponse(e);
        }
        throw error;
    }
}