'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { TabPanel, TabView } from 'primereact/tabview';
import { Toast } from 'primereact/toast';

import { UiUtils } from '@/rs/service';
import { ApiErrInfo, ApiProps } from '@/types/booking';
import { ApiUtils } from '@/rs/service/ApiUtil';
import { confirmDialog } from 'primereact/confirmdialog';
import { ProductionApi } from '@/rs/service/ProductionApi';
import { ProgressSpinner } from 'primereact/progressspinner';
import AttendImpsTbl from '@/rs/components/attendance/AttendImpsTbl';

interface AttendImpsProps {}

const AttendImps = (props: AttendImpsProps) => {
    const conf = useSelector((state: any) => state.settings);
    const auth = useSelector((state: any) => state.auth);

    const [search, setSearch] = useState<string>('');
    const [selAttendImp, setSelAttendImp] = useState<any>({});
    const [reload, setReload] = useState<boolean>(false);
    const [busy, setBusy] = useState<any>(false);

    const apiRef = useRef<ProductionApi>();
    const toastRef = useRef<Toast>(null);

    useEffect(() => {
        let apiProps: ApiProps = {
            ...conf,
            token: auth?.token
        };
        let api = new ProductionApi(apiProps);
        apiRef.current = api;
    }, [conf, auth]);

    const _errHandler = useCallback((errInf: ApiErrInfo) => {
        UiUtils.showError({
            ...errInf,
            toast: toastRef.current
        });
    }, []);

    // const _onNewAttendImp = (evt: any) => {
    //     setSelAttendImp({});
    // };

    // const _onAttendImpFormAction = (evt: any) => {
    //     setReload(!reload);
    // };

    const _onDelete = async (evt: any) => {
        if (!selAttendImp?.id) {
            console.log('no AttendImp selected');
            return;
        }

        let saveFn = async () => {
            let api = apiRef.current;
            if (!api) {
                return;
            }
            setBusy(true);
            let data = await ApiUtils.getApiData({
                api: api.facLineDelete(selAttendImp.id),
                name: 'facLineDelete',
                errHandler: _errHandler
            });
            setBusy(false);
            if (!data) {
                return;
            }
            setSelAttendImp({});
            UiUtils.showInfo({
                detail: 'Success',
                toast: toastRef.current
            });
            setReload(!reload);
        };

        let header = 'Confirmation';
        let message = 'Are you sure to delete selected proudction line?';
        confirmDialog({
            header,
            message,
            acceptIcon: 'pi pi-check',
            rejectIcon: 'pi pi-times',
            accept: () => {
                saveFn();
            },
            reject: () => {}
        });
    };

    const tblHeader = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Available attendance imports</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" value={search} onInput={(e) => setSearch((e.target as HTMLInputElement).value)} placeholder="Search..." />
            </span>
        </div>
    );

    return (
        <>
            <Toast ref={toastRef} />
            {busy && <ProgressSpinner className="page-spinner" />}
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <AttendImpsTbl header={tblHeader} search={search} selection={selAttendImp} reload={reload} onSelect={(e) => setSelAttendImp(e.value)} />
                        <div className="py-3 flex justify-content-end">
                            <Button label="Delete" icon="pi pi-times" className="ml-2" onClick={_onDelete} />
                        </div>
                        <TabView>
                            <TabPanel header="General">
                                <div className="grid">
                                    <div className="col-12 lg:col-6"></div>
                                </div>
                            </TabPanel>
                            {/* <TabPanel header="Staff">{selAttendImp?.id && <AttendImpStaffTab dept={selAttendImp} />}</TabPanel> */}
                        </TabView>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AttendImps;
