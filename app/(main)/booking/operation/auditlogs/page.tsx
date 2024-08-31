'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'primereact/button';
// import { confirmDialog } from 'primereact/confirmdialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { saveAs } from 'file-saver';

import { AppApi, UiUtils } from '@/rs/service';
import { ApiUtils } from '@/rs/service/ApiUtil';
import { ApiErrInfo, ApiProps, EvtHandler } from '@/types/booking';
import AuditLogsTbl from '@/rs/components/audit/AuditLogsTbl';
import LogFilter from '@/rs/components/audit/LogFilter';

interface AuditLogsProps {}

const AuditLogs = (props: AuditLogsProps) => {
    const conf = useSelector((state: any) => state.settings);
    const auth = useSelector((state: any) => state.auth);

    // const [search, setSearch] = useState<string>('');
    const [filter, setFilter] = useState<any>({});
    const [selAuditLog, setSelAuditLog] = useState<any>({});

    const apiRef = useRef<AppApi>();
    const toastRef = useRef<Toast>(null);

    const { search, username, action, fromDate, toDate } = filter;

    useEffect(() => {
        let apiProps: ApiProps = {
            ...conf,
            token: auth?.token
        };
        let api = new AppApi(apiProps);
        apiRef.current = api;
    }, [conf, auth]);

    const _errHandler = useCallback((errInf: ApiErrInfo) => {
        UiUtils.showError({
            ...errInf,
            toast: toastRef.current
        });
    }, []);

    const _downloadLog = useCallback(
        async ({ id }: { id: any }) => {
            let api: AppApi | undefined = apiRef.current;
            if (!api) {
                return;
            }

            let data = await ApiUtils.getApiData({
                api: api.getAuditData(id),
                name: 'getAuditData',
                errHandler: _errHandler
            });

            if (!data) {
                return;
            }

            let bin: string = data.binary;
            //decode base64 to binary string
            //bin = atob(bin);
            bin = Buffer.from(bin, 'base64').toString();

            //create byte array
            var arr = [];
            for (var i = 0; i < bin.length; i++) {
                arr.push(bin.charCodeAt(i));
            }
            //convert array to bytes array
            let binArr = Uint8Array.from(arr);

            var blob = new Blob([binArr], {
                type: 'application/octet-stream'
            });
            saveAs(blob, 'audit-data.gz');
        },
        [_errHandler]
    );

    const _onFilterChanged: EvtHandler = (evt) => {
        console.log('Filter changed', evt);
        setFilter({ ...evt });
    };

    return (
        <>
            <Toast ref={toastRef} />

            <div className="grid">
                <div className="col-12">
                    <LogFilter onChanged={_onFilterChanged} />
                    <div className="card">
                        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 className="m-0">Audit logs</h5>
                            {/* <span className="block mt-2 md:mt-0 p-input-icon-left">
                                <i className="pi pi-search" />
                                <InputText type="search" value={search} onInput={(e) => setSearch((e.target as HTMLInputElement).value)} placeholder="Search..." />
                            </span> */}
                        </div>
                        <AuditLogsTbl search={search} username={username} action={action} fromDate={fromDate} toDate={toDate} selection={selAuditLog} onSelect={(e) => setSelAuditLog(e.value)} />
                        <div className="py-3 flex justify-content-end">
                            {false && selAuditLog?.id && (
                                <Button
                                    label="Download"
                                    icon="pi pi-download"
                                    onClick={(e) => {
                                        _downloadLog(selAuditLog?.id);
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AuditLogs;
