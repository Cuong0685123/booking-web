import _ from 'lodash';
import moment from 'moment';
import Axios, { AxiosInstance } from 'axios';
import { NoArgFn, ShowErrorMsgType, ShowMsgType } from '@/types';

export class AppUtils {
    static async loadUiVersion(): Promise<any> {
        const http: AxiosInstance = Axios.create();
        http.defaults.timeout = 30000;
        let axiosCf = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        let url = '/booking/version.json';
        let data = http.get(url, axiosCf).then((resp) => resp.data);
        return data;
    }

    static assign(obj: any, ...sources: Array<any>): any {
        return _.assign(obj, ...sources);
    }

    // const get = (obj: any, path: any, defVal: any): any = {
    //   return _.get(obj,path, defVal);
    // }

    static get(obj: any, path: Array<string> | string, defVal: any): any {
        return _.get(obj, path, defVal);
    }

    static isDate(obj: any): any {
        return _.isDate(obj);
    }

    static round(num: any, scale?: number): number {
        if (isNaN(num)) {
            num = Number(num);
        }
        if (isNaN(Number(scale))) {
            scale = 2;
        }
        // scale = scale || 2;
        // console.log('scale', scale, 'num', num);
        return _.round(num, scale);
    }

    static fmtDecimal(num: number, scale: number = 2): string {
        num = Number(num);
        if (!_.isNumber(num)) {
            return '' + num;
        }
        num = _.round(num, scale);
        let snum: string = num.toString();
        let pos = snum.indexOf('.');
        if (pos < 0) {
            return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        }
        let s1 = snum.substring(0, pos);
        let s2 = snum.substring(pos);
        return s1.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + s2;
    }

    static parseTime(str: string, fmt?: any): any {
        if (!fmt) {
            fmt = 'HH:mm:ss';
        }
        let dateObj = moment(str, fmt).toDate();
        return dateObj;
    }

    static jsDateAfter(srcDt: any, targetDt: any): boolean {
        return moment(srcDt).isAfter(moment(targetDt));
    }

    static jsDateBefore(srcDt: any, targetDt: any): boolean {
        return moment(srcDt).isBefore(moment(targetDt));
    }

    static jsDateToStr(jsDate: any, fmt?: any): string {
        if (!jsDate) {
            return '';
        }
        if (!fmt) {
            fmt = 'YYYY-MM-DD HH:mm:ss';
        }
        return moment(jsDate).format(fmt);
    }

    static toJsDate(str: string, defVal?: any): any {
        if (str === null || str === undefined) {
            return defVal || null;
        }
        const dateObj = moment(str, 'YYYY-MM-DD HH:mm:ss').toDate();
        return dateObj;
    }

    static localTimeOffset(): any {
        let dt = new Date();
        let res = dt.getTimezoneOffset();
        return res;
    }

    static toLocalDate = (jsDate: any, tzOffset: any = undefined): any => {
        let offset = AppUtils.isNum(tzOffset) ? tzOffset : AppUtils.localTimeOffset();
        // console.log('offset', -tzOffset);
        let obj = moment(jsDate).add(-tzOffset, 'm').toDate();
        return obj;
    };

    static toUtcDate = (jsDate: any, tzOffset: any = undefined) => {
        let offset = AppUtils.isNum(tzOffset) ? tzOffset : AppUtils.localTimeOffset();
        let obj = moment(jsDate).add(offset, 'm').toDate();
        return obj;
    };

    static addDays(srcD: any, nbDays: number, fmt?: string): string | any {
        let newD = moment(srcD).add(nbDays, 'd');
        if (fmt) {
            return newD.format(fmt);
        }
        return newD.toDate();
    }

    static addMins(srcD: any, mins: number, fmt?: string): string | any {
        let newD = moment(srcD).add(mins, 'm');
        if (fmt) {
            return newD.format(fmt);
        }
        return newD.toDate();
    }

    static addMonths(srcD: any, nbMonths: number, fmt?: string): string | any {
        let newD = moment(srcD).add(nbMonths, 'month');
        if (fmt) {
            return newD.format(fmt);
        }
        return newD.toDate();
    }

    static getDateInfo(srcD: any): any {
        let newD = moment(srcD);
        return {
            year: newD.year(),
            month: newD.month() + 1,
            day: newD.date(),
            hour: newD.hour(),
            minute: newD.minute(),
            second: newD.second(),
            ms: newD.milliseconds()
        };
    }

    static toTimestamp(srcD: any): any {
        let mo = moment(srcD);
        return mo.unix();
    }

    static setDateInfo(srcDt: any, field: any, value: any) {
        let newDt = moment(srcDt);
        newDt.set(field, value);
        return newDt.toDate();
    }

    static truncDate(srcDt: any, field: any) {
        let newDt = moment(srcDt);
        newDt.startOf(field);
        return newDt.toDate();
    }

    static isNum(val: any): boolean {
        return _.isNumber(val);
    }

    static toNum(str: any): number {
        if (_.isNumber(str)) {
            return str;
        }
        if (!_.isString(str)) {
            return 0;
        }
        if (_.isEmpty(str)) {
            return 0;
        }
        str = str.replace(/[,]+/, '');
        let num = _.toNumber(str);
        return num;
    }

    static reFmtDate(str: string, fmt: string = '', opts: any = {}): string {
        // let { str, fmt, tzOffset } = opts;
        if (_.isEmpty(str)) {
            return str;
        }
        if (_.isEmpty(fmt)) {
            fmt = 'DD/MM/YYYY';
        }
        let jsDate = AppUtils.toJsDate(str);
        let offset = opts?.offset;
        let num = Number(offset);
        if (!isNaN(num)) {
            jsDate = AppUtils.addMins(jsDate, -num);
        }
        return AppUtils.jsDateToStr(jsDate, fmt);
    }

    static isEmpty(val: any): boolean {
        return val === undefined || val === null || (_.isString(val) && val.trim().length < 1);
        // return _.isEmpty(val);
    }

    static downloadFile(url: any): any {
        console.log('Downloading: ', url);
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        // Prevent from affecting the page
        iframe.style.height = '0';
        // prevent affecting the page
        iframe.src = url;
        if (document.body) {
            document.body.appendChild(iframe);
        }
        // This line must be, the iframe will be hung on the dom tree to send a request
        // Delete after 5 minutes (onload method does not work for download links, just pick your feet first)
        setTimeout(() => {
            iframe.remove();
        }, 5 * 60 * 1000);
    }
}

// const AppUtils = {
//     assign,
//     get,
//     isDate,
//     round,
//     fmtDecimal,
//     parseTime,
//     jsDateToStr,
//     toJsDate,
//     toLocalDate,
//     toUtcDate,
//     addDays,
//     addMonths,
//     getDateInfo,
//     toTimestamp,
//     toNum,
//     isNum,
//     reFmtDate,
//     isEmpty,
//     downloadFile,
//     loadUiVersion
// };

const showError = (arg: ShowErrorMsgType) => {
    let { summary, detail, errors, error, toast, sticky, severity } = arg;
    summary = summary || 'Error';
    severity = severity || 'error';
    if (sticky === undefined) {
        sticky = false;
    }
    if (detail) {
        toast.show({ severity, summary, detail, sticky });
        return;
    }
    if (errors || error) {
        let err: Record<string, any> = {};
        if (errors) {
            err = errors[0];
        } else if (error) {
            err = error;
        }
        // $FlowFixMe[incompatible-use]
        let { userMsg, message } = err;
        let detail: any = null;
        if (userMsg) {
            detail = userMsg;
        } else if (message) {
            detail = message;
        }
        detail = detail || 'Internal server error';
        if (detail && toast) {
            toast.show({ severity, summary, detail, sticky });
        }
        return;
    }
};

const showInfo = (arg: ShowMsgType) => {
    let { summary, detail, toast, sticky } = arg;
    let severity = 'info';
    summary = summary || 'Information';
    if (sticky === undefined) {
        sticky = false;
    }
    if (toast) {
        toast.show({
            severity,
            summary,
            detail,
            sticky
        });
    }
};

const showWarning = (arg: ShowMsgType) => {
    let { summary, detail, sticky, toast } = arg;
    let severity = 'warn';
    summary = summary || 'Warning';
    if (sticky === undefined) {
        sticky = false;
    }
    if (toast) {
        toast.show({
            severity,
            summary,
            detail,
            sticky
        });
    }
};

const UiUtils = { showError, showInfo, showWarning };
export { UiUtils };
