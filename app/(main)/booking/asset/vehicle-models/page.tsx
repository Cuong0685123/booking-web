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
import { AssetApi } from '@/rs/service/AssetApi';
import { ProgressSpinner } from 'primereact/progressspinner';
import VehicleModelsTbl from '@/rs/components/asset/vehicle/VehicleModelsTbl';
import VehicleModelForm from '@/rs/components/asset/vehicle/VehicleModelForm';

interface VehicleModelsProps {}

const VehicleModels = (props: VehicleModelsProps) => {
    const conf = useSelector((state: any) => state.settings);
    const auth = useSelector((state: any) => state.auth);

    const [search, setSearch] = useState<string>('');
    const [selVehicleModel, setSelVehicleModel] = useState<any>({});
    const [reload, setReload] = useState<boolean>(false);
    const [busy, setBusy] = useState<any>(false);

    const apiRef = useRef<AssetApi>();
    const toastRef = useRef<Toast>(null);

    useEffect(() => {
        let apiProps: ApiProps = {
            ...conf,
            token: auth?.token
        };
        let api = new AssetApi(apiProps);
        apiRef.current = api;
    }, [conf, auth]);

    const _errHandler = useCallback((errInf: ApiErrInfo) => {
        UiUtils.showError({
            ...errInf,
            toast: toastRef.current
        });
    }, []);

    const _onNewVehicleModel = (evt: any) => {
        setSelVehicleModel({});
    };

    const _onVehicleModelFormAction = (evt: any) => {
        setReload(!reload);
    };

    const _onDelete = async (evt: any) => {
        if (!selVehicleModel?.id) {
            console.log('no VehicleModel selected');
            return;
        }

        let saveFn = async () => {
            let api = apiRef.current;
            if (!api) {
                return;
            }
            setBusy(true);
            let data = await ApiUtils.getApiData({
                api: api.vehicleModelDelete(selVehicleModel.id),
                name: 'vehicleModelDelete',
                errHandler: _errHandler
            });
            setBusy(false);
            if (!data) {
                return;
            }
            setSelVehicleModel({});
            UiUtils.showInfo({
                detail: 'Success',
                toast: toastRef.current
            });
            setReload(!reload);
        };

        let header = 'Confirmation';
        let message = 'Are you sure to delete selected vehicle model?';
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
    //     if (!selVehicleModel?.id || !selAvaiRole?.id) {
    //         console.log('VehicleModel or role is not selected: profile=,', selVehicleModel, ', role=', selAvaiRole);
    //         return;
    //     }

    //     let api = apiRef.current;
    //     if (!api) {
    //         return;
    //     }

    //     let saveFn = async () => {
    //         let data = await ApiUtils.getApiData({
    //             api: api.linkVehicleModelRoles(selVehicleModel.id, [selAvaiRole]),
    //             name: 'linkVehicleModelRoles',
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
    //     if (!selVehicleModel?.id || !selAssignedRole?.id) {
    //         console.log('VehicleModel or role is not selected: profile=,', selVehicleModel, ', role=', selAssignedRole);
    //         return;
    //     }

    //     let api = apiRef.current;
    //     if (!api) {
    //         return;
    //     }

    //     let saveFn = async () => {
    //         let data = await ApiUtils.getApiData({
    //             api: api.unlinkVehicleModelRoles(selVehicleModel.id, [selAssignedRole]),
    //             name: 'unlinkVehicleModelRoles',
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
            <h5 className="m-0">Available vehicle models</h5>
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
                        <VehicleModelsTbl header={deptsHeader} search={search} selection={selVehicleModel} reload={reload} onSelect={(e) => setSelVehicleModel(e.value)} />
                        <div className="py-3 flex justify-content-end">
                            <Button label="New Model" icon="pi pi-plus" onClick={_onNewVehicleModel} />
                            <Button label="Delete" icon="pi pi-times" className="ml-2" onClick={_onDelete} />
                        </div>
                        <TabView>
                            <TabPanel header="General">
                                <div className="grid">
                                    <div className="col-12 lg:col-6">
                                        <VehicleModelForm vehicleModel={selVehicleModel} onAction={_onVehicleModelFormAction} />
                                    </div>
                                </div>
                            </TabPanel>
                            {/* <TabPanel header="Staff">{selVehicleModel?.id && <VehicleModelStaffTab dept={selVehicleModel} />}</TabPanel> */}
                        </TabView>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VehicleModels;
