import type { ApiProps, PostType, DelType, QueryObjsType } from '@/types';

import { Api } from './Api';

const API_SUPPLIER_LIST = '/suppliers';
const API_SUPPLIER_UPDATE = '/supplier/update';
const API_SUPPLIER_DELETE = '/suppliers/{id}';

export class BookingApi {
    api: Api;

    constructor(props: ApiProps) {
        this.api = new Api(props);
    }

    supplierList(args: QueryObjsType): Promise<any> {
        let url = this.api.prepareUrl(API_SUPPLIER_LIST, {});
        return this.api.post({ url, data: { ...args } });
    }

    supplierUpdate(obj: any): Promise<any> {
        let url = this.api.prepareUrl(API_SUPPLIER_UPDATE, {});
        let args: PostType = { url, data: { data: { ...obj } } };
        return this.api.post(args);
    }

    supplierDelete(id: number): Promise<any> {
        let url = this.api.prepareUrl(API_SUPPLIER_DELETE, { id });
        let args: DelType = { url };
        return this.api.delete(args);
    }
}
