import type { ApiDataOpts } from '@/types/booking';

const getApiData: (options: ApiDataOpts) => any = async (options: ApiDataOpts) => {
    let { api, errHandler } = options;
    if (!api) {
        return;
    }
    let name: string = options.name || '';
    return await api
        .then((resp) => resp.data)
        .then((resp) => {
            let { errors, data } = resp;
            if (errors.length > 0) {
                console.log(`${name} // return errors`, errors);
                errHandler && errHandler({ errors });
                return null;
            }
            return data;
        })
        .catch((error) => {
            console.log(`${name} // network error`, error);
            errHandler && errHandler({ error });
            return null;
        });
};

const ApiUtils = {
    getApiData
};

export { ApiUtils };
