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
import FuelReceiptsTbl from '@/rs/components/production/FuelReceiptsTbl';
import FuelReceiptForm from '@/rs/components/production/FuelReceiptForm';
import FuelReceiptFilter from '@/rs/components/production/FuelReceiptFilter';
import FuelReceiptLogsTbl from '@/rs/components/production/FuelReceiptLogsTbl';

interface FuelReceiptsProps {}

const FuelReceipts = (props: FuelReceiptsProps) => {
    const conf = useSelector((state: any) => state.settings);
    const auth = useSelector((state: any) => state.auth);

    const [filter, setFilter] = useState<any>({});
    const [selFuelReceipt, setSelFuelReceipt] = useState<any>({});
    const [reload, setReload] = useState<boolean>(false);
    const [busy, setBusy] = useState<any>(false);

    const apiRef = useRef<ProductionApi>();
    const toastRef = useRef<Toast>(null);
    const { search, dept, line, machine, vehicle, staff, usageDateFrom, usageDateTo } = filter;

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
        setSelFuelReceipt({});
    }, [search, dept, staff, usageDateTo]);

    const _onNewFuelReceipt = (evt: any) => {
        setSelFuelReceipt({});
    };

    const _onFuelReceiptFormAction = (evt: any) => {
        setReload(!reload);
    };

    const _onDelete = async (evt: any) => {
        if (!selFuelReceipt?.id) {
            console.log('no FuelReceipt selected');
            return;
        }

        let saveFn = async () => {
            let api = apiRef.current;
            if (!api) {
                return;
            }
            setBusy(true);
            let data = await ApiUtils.getApiData({
                api: api.fuelReceiptDelete(selFuelReceipt.id),
                name: 'fuelReceiptDelete',
                errHandler: _errHandler
            });
            setBusy(false);
            if (!data) {
                return;
            }
            setSelFuelReceipt({});
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
    //     if (!selFuelReceipt?.id || !selAvaiRole?.id) {
    //         console.log('FuelReceipt or role is not selected: profile=,', selFuelReceipt, ', role=', selAvaiRole);
    //         return;
    //     }

    //     let api = apiRef.current;
    //     if (!api) {
    //         return;
    //     }

    //     let saveFn = async () => {
    //         let data = await ApiUtils.getApiData({
    //             api: api.linkFuelReceiptRoles(selFuelReceipt.id, [selAvaiRole]),
    //             name: 'linkFuelReceiptRoles',
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
    //     if (!selFuelReceipt?.id || !selAssignedRole?.id) {
    //         console.log('FuelReceipt or role is not selected: profile=,', selFuelReceipt, ', role=', selAssignedRole);
    //         return;
    //     }

    //     let api = apiRef.current;
    //     if (!api) {
    //         return;
    //     }

    //     let saveFn = async () => {
    //         let data = await ApiUtils.getApiData({
    //             api: api.unlinkFuelReceiptRoles(selFuelReceipt.id, [selAssignedRole]),
    //             name: 'unlinkFuelReceiptRoles',
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
            <h5 className="m-0">Available receipts</h5>
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
                        <FuelReceiptFilter
                            onChanged={(val) => {
                                let newFil: any = val || {};
                                // console.log('new fil', { ...newFil });
                                setFilter({ ...newFil });
                            }}
                        />
                        <FuelReceiptsTbl
                            header={deptsHeader}
                            showPageTotal={true}
                            showGrandTotal={true}
                            search={search}
                            byDept={dept}
                            byLine={line}
                            byMachine={machine}
                            byVehicle={vehicle}
                            byStaff={staff}
                            usageDateFrom={usageDateFrom}
                            usageDateTo={usageDateTo}
                            selection={selFuelReceipt}
                            reload={reload}
                            onSelect={(e) => setSelFuelReceipt(e.value)}
                        />
                        <div className="py-3 flex justify-content-end">
                            <Button label="New Receipt" icon="pi pi-plus" onClick={_onNewFuelReceipt} />
                            <Button label="Delete" icon="pi pi-times" className="ml-2" onClick={_onDelete} />
                        </div>
                        <TabView>
                            <TabPanel header="General">
                                <FuelReceiptForm fuelReceipt={selFuelReceipt} onAction={_onFuelReceiptFormAction} />
                            </TabPanel>
                            <TabPanel header="Logs">
                                <FuelReceiptLogsTbl receipt={selFuelReceipt} />
                            </TabPanel>
                        </TabView>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FuelReceipts;
