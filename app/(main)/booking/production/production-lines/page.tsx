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
import FacLinesTbl from '@/rs/components/production/FacLinesTbl';
import FacLineForm from '@/rs/components/production/FacLineForm';

interface FacLinesProps {}

const FacLines = (props: FacLinesProps) => {
    const conf = useSelector((state: any) => state.settings);
    const auth = useSelector((state: any) => state.auth);

    const [search, setSearch] = useState<string>('');
    const [selFacLine, setSelFacLine] = useState<any>({});
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

    const _onNewFacLine = (evt: any) => {
        setSelFacLine({});
    };

    const _onFacLineFormAction = (evt: any) => {
        setReload(!reload);
    };

    const _onDelete = async (evt: any) => {
        if (!selFacLine?.id) {
            console.log('no FacLine selected');
            return;
        }

        let saveFn = async () => {
            let api = apiRef.current;
            if (!api) {
                return;
            }
            setBusy(true);
            let data = await ApiUtils.getApiData({
                api: api.facLineDelete(selFacLine.id),
                name: 'facLineDelete',
                errHandler: _errHandler
            });
            setBusy(false);
            if (!data) {
                return;
            }
            setSelFacLine({});
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

    // const _onAssignRole = async (evt: any) => {
    //     if (!selFacLine?.id || !selAvaiRole?.id) {
    //         console.log('FacLine or role is not selected: profile=,', selFacLine, ', role=', selAvaiRole);
    //         return;
    //     }

    //     let api = apiRef.current;
    //     if (!api) {
    //         return;
    //     }

    //     let saveFn = async () => {
    //         let data = await ApiUtils.getApiData({
    //             api: api.linkFacLineRoles(selFacLine.id, [selAvaiRole]),
    //             name: 'linkFacLineRoles',
    //             errHandler: _errHandler
    //         });
    //         if (!data) {
    //             return;
    //         }
    //         UiUtils.showInfo({
    //             detail: 'Success',
    //             toast: toastRef.current
    //         });
    //         setSelAvaiRole({});
    //         setRoleReload(!rolesReload);
    //     };

    //     let header = 'Confirmation';
    //     let message = 'Are you sure to assign selected role to current user?';
    //     confirmDialog({
    //         header,
    //         message,
    //         acceptIcon: 'pi pi-check',
    //         rejectIcon: 'pi pi-times',
    //         accept: () => {
    //             saveFn();
    //         },
    //         reject: () => {}
    //     });
    // };

    // const _onRevokeRole = (evt: any) => {
    //     if (!selFacLine?.id || !selAssignedRole?.id) {
    //         console.log('FacLine or role is not selected: profile=,', selFacLine, ', role=', selAssignedRole);
    //         return;
    //     }

    //     let api = apiRef.current;
    //     if (!api) {
    //         return;
    //     }

    //     let saveFn = async () => {
    //         let data = await ApiUtils.getApiData({
    //             api: api.unlinkFacLineRoles(selFacLine.id, [selAssignedRole]),
    //             name: 'unlinkFacLineRoles',
    //             errHandler: _errHandler
    //         });
    //         if (!data) {
    //             return;
    //         }
    //         UiUtils.showInfo({
    //             detail: 'Success',
    //             toast: toastRef.current
    //         });
    //         setSelAvaiRole({});
    //         setRoleReload(!rolesReload);
    //     };

    //     let header = 'Confirmation';
    //     let message = 'Are you sure to assign selected role to current user?';
    //     confirmDialog({
    //         header,
    //         message,
    //         acceptIcon: 'pi pi-check',
    //         rejectIcon: 'pi pi-times',
    //         accept: () => {
    //             saveFn();
    //         },
    //         reject: () => {}
    //     });
    // };

    const deptsHeader = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Available production lines</h5>
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
                        <FacLinesTbl header={deptsHeader} search={search} selection={selFacLine} reload={reload} onSelect={(e) => setSelFacLine(e.value)} />
                        <div className="py-3 flex justify-content-end">
                            <Button label="New Line" icon="pi pi-plus" onClick={_onNewFacLine} />
                            <Button label="Delete" icon="pi pi-times" className="ml-2" onClick={_onDelete} />
                        </div>
                        <TabView>
                            <TabPanel header="General">
                                <div className="grid">
                                    <div className="col-12 lg:col-6">
                                        <FacLineForm facLine={selFacLine} onAction={_onFacLineFormAction} />
                                    </div>
                                </div>
                            </TabPanel>
                            {/* <TabPanel header="Staff">{selFacLine?.id && <FacLineStaffTab dept={selFacLine} />}</TabPanel> */}
                        </TabView>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FacLines;
