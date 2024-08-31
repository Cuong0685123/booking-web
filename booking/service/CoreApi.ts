import _ from 'lodash';
import { Buffer } from 'buffer';
import type { ApiProps, PostType, QueryObjsType } from '@/types';
import { Api } from './Api';

type LoginType = {
    username: string;
    password: string;
    timeout?: number;
};

const API_HELLO_SERVER = '/hello';
const API_LOGIN = '/login';
const API_GET_VERSION = '/version';

const API_DOWNLOAD = '/download/{file}';

export class CoreApi {
    api: Api;
    constructor(props: ApiProps) {
        this.api = new Api(props);
    }

    hello(): Promise<any> {
        let url = this.api.prepareUrl(API_HELLO_SERVER);
        return this.api.get({ url });
    }

    version(): Promise<any> {
        let url = this.api.prepareUrl(API_GET_VERSION);
        return this.api.get({ url });
    }

    login(arg: LoginType): Promise<any> {
        let { username, password, timeout } = arg;
        let url = this.api.prepareUrl(API_LOGIN, {});
        let data = { username, password };
        return this.api.post({ url, data, timeout });
    }

    getDownloadUrl(file: string): string {
        let buff = Buffer.from(file);
        let path = buff.toString('base64');
        let url = this.api.prepareUrl(API_DOWNLOAD, { file: path });
        return url;
    }
}
