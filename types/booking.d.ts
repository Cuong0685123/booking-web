export type NoArgFn<T> = () => T;
export type CommonFn<T, R> = (opt: T) => R;
export type TwoArgsFn<T, X, R> = (a: T, b: X) => R;

export interface ApiProps {
    apiUrl: string;
    apiVersion: string;
    token?: string;
}

export interface GetType {
    url: string;
}

export interface PostType {
    url: string;
    data: any;
    timeout?: number;
}

export interface PutType {
    url: string;
    data: any;
}

export interface DelType {
    url: string;
}

export interface QueryObjsType {
    search?: string;
    fields?: string[];
    distinct?: any;
    filters?: any;
    params?: any;
    joins?: any[];
    sorts?: string[];
    start: number;
    limit: number;
}

export interface SendObjType {
    data: any;
}

export interface PostWithTimoutType {
    url: any;
    data: any;
    timeout: any;
    axiosConf?: any;
}

export interface ShowMsgType {
    summary?: string;
    detail?: string;
    toast: any;
    sticky?: boolean;
    t?: any;
    severity?: string;
}

export interface ShowErrorMsgType extends ShowMsgType {
    error?: any;
    errors?: any[];
}

export interface ApiErrInfo {
    error?: any;
    errors?: any[];
}

export type ApiErrHandler = (errInf: ApiErrInfo) => any;

export interface ApiDataOpts {
    api?: Promise<any>;
    name?: string;
    errHandler?: ApiErrHandler;
}

export type EvtHandler = (evt: any) => any;
export type TblColRender = (row: any, col: any) => any;

declare namespace Booking {}
