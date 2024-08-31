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
import FuelPosTbl from '@/rs/components/production/FuelPosTbl';
import FuelPoForm from '@/rs/components/production/FuelPoForm';
import FuelPoFilter from '@/rs/components/production/FuelPoFilter';
import LogFilter from '@/rs/components/audit/LogFilter';
import FuelPoLogsTbl from '@/rs/components/production/FuelPoLogsTbl';

interface FuelPosProps {}

const FuelPos = (props: FuelPosProps) => {
    const conf = useSelector((state: any) => state.settings);
    const auth = useSelector((state: any) => state.auth);

    const [filter, setFilter] = useState<any>({});
    const [selFuelPo, setSelFuelPo] = useState<any>({});
    const [reload, setReload] = useState<boolean>(false);
    const [busy, setBusy] = useState<any>(false);

    const apiRef = useRef<ProductionApi>();
    const toastRef = useRef<Toast>(null);
    const { search, poDateFrom, poDateTo } = filter;

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

    useEffect(() => {
        setSelFuelPo({});
    }, [search, poDateFrom, poDateTo]);

    const _onNewFuelPo = (evt: any) => {
        setSelFuelPo({});
    };

    const _onFuelPoFormAction = (evt: any) => {
        setReload(!reload);
    };

    const _onDelete = async (evt: any) => {
        if (!selFuelPo?.id) {
            console.log('no FuelPo selected');
            return;
        }

        let saveFn = async () => {
            let api = apiRef.current;
            if (!api) {
                return;
            }
            setBusy(true);
            let data = await ApiUtils.getApiData({
                api: api.fuelPoDelete(selFuelPo.id),
                name: 'fuelPoDelete',
                errHandler: _errHandler
            });
            setBusy(false);
            if (!data) {
                return;
            }
            setSelFuelPo({});
            UiUtils.showInfo({
                detail: 'Success',
                toast: toastRef.current
            });
            setReload(!reload);
        };

        let header = 'Confirmation';
        let message = 'Are you sure to delete selected receipt?';
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
    //     if (!selFuelPo?.id || !selAvaiRole?.id) {
    //         console.log('FuelPo or role is not selected: profile=,', selFuelPo, ', role=', selAvaiRole);
    //         return;
    //     }

    //     let api = apiRef.current;
    //     if (!api) {
    //         return;
    //     }

    //     let saveFn = async () => {
    //         let data = await ApiUtils.getApiData({
    //             api: api.linkFuelPoRoles(selFuelPo.id, [selAvaiRole]),
    //             name: 'linkFuelPoRoles',
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
    //     if (!selFuelPo?.id || !selAssignedRole?.id) {
    //         console.log('FuelPo or role is not selected: profile=,', selFuelPo, ', role=', selAssignedRole);
    //         return;
    //     }

    //     let api = apiRef.current;
    //     if (!api) {
    //         return;
    //     }

    //     let saveFn = async () => {
    //         let data = await ApiUtils.getApiData({
    //             api: api.unlinkFuelPoRoles(selFuelPo.id, [selAssignedRole]),
    //             name: 'unlinkFuelPoRoles',
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
            <h5 className="m-0">Available purchasing receipts</h5>
            {/* <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" value={search} onInput={(e) => setSearch((e.target as HTMLInputElement).value)} placeholder="Search..." />
            </span> */}
        </div>
    );

    return (
        <>
            <Toast ref={toastRef} />
            {busy && <ProgressSpinner className="page-spinner" />}
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <FuelPoFilter
                            onChanged={(val) => {
                                let newFil: any = val || {};
                                setFilter({ ...newFil });
                            }}
                        />
                        <FuelPosTbl header={deptsHeader} showPageTotal={true} showGrandTotal={true} search={search} poDateFrom={poDateFrom} poDateTo={poDateTo} selection={selFuelPo} reload={reload} onSelect={(e) => setSelFuelPo(e.value)} />
                        <div className="py-3 flex justify-content-end">
                            <Button label="New Purchase Receipt" icon="pi pi-plus" onClick={_onNewFuelPo} />
                            <Button label="Delete" icon="pi pi-times" className="ml-2" onClick={_onDelete} />
                        </div>
                        <TabView>
                            <TabPanel header="General">
                                <FuelPoForm fuelPo={selFuelPo} onAction={_onFuelPoFormAction} />
                            </TabPanel>
                            <TabPanel header="Logs">
                                <FuelPoLogsTbl po={selFuelPo} />
                            </TabPanel>
                        </TabView>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FuelPos;
