'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { TabPanel, TabView } from 'primereact/tabview';
import { Toast } from 'primereact/toast';

import StaffForm from '@/rs/components/organization/StaffForm';
import StaffsTbl from '@/rs/components/organization/StaffsTbl';
import { UiUtils } from '@/rs/service';
import { ApiErrInfo, ApiProps } from '@/types/booking';
import { ApiUtils } from '@/rs/service/ApiUtil';
import { confirmDialog } from 'primereact/confirmdialog';
import { DeptApi } from '@/rs/service/DeptApi';
import { ProgressSpinner } from 'primereact/progressspinner';
import DeptsTbl from '@/rs/components/organization/DeptsTbl';

interface StaffsProps {}

const Staffs = (props: StaffsProps) => {
    const conf = useSelector((state: any) => state.settings);
    const auth = useSelector((state: any) => state.auth);

    const [search, setSearch] = useState<string>('');
    const [selStaff, setSelStaff] = useState<any>({});
    const [reload, setReload] = useState<boolean>(false);
    const [busy, setBusy] = useState<any>(false);

    const apiRef = useRef<DeptApi>();
    const toastRef = useRef<Toast>(null);

    useEffect(() => {
        let apiProps: ApiProps = {
            ...conf,
            token: auth?.token
        };
        let api = new DeptApi(apiProps);
        apiRef.current = api;
    }, [conf, auth]);

    const _errHandler = useCallback((errInf: ApiErrInfo) => {
        UiUtils.showError({
            ...errInf,
            toast: toastRef.current
        });
    }, []);

    const _onNewStaff = (evt: any) => {
        setSelStaff({});
    };

    const _onStaffFormAction = (evt: any) => {
        setReload(!reload);
    };

    const _onDelete = async (evt: any) => {
        if (!selStaff?.id) {
            console.log('no Staff selected');
            return;
        }

        let saveFn = async () => {
            let api = apiRef.current;
            if (!api) {
                return;
            }
            setBusy(true);
            let data = await ApiUtils.getApiData({
                api: api.staffDelete(selStaff.id),
                name: 'staffDelete',
                errHandler: _errHandler
            });
            setBusy(false);
            if (!data) {
                return;
            }
            setSelStaff({});
            UiUtils.showInfo({
                detail: 'Success',
                toast: toastRef.current
            });
            setReload(!reload);
        };

        let header = 'Confirmation';
        let message = 'Are you sure to delete selected staff?';
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
    //     if (!selStaff?.id || !selAvaiRole?.id) {
    //         console.log('Staff or role is not selected: profile=,', selStaff, ', role=', selAvaiRole);
    //         return;
    //     }

    //     let api = apiRef.current;
    //     if (!api) {
    //         return;
    //     }

    //     let saveFn = async () => {
    //         let data = await ApiUtils.getApiData({
    //             api: api.linkStaffRoles(selStaff.id, [selAvaiRole]),
    //             name: 'linkStaffRoles',
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
    //     if (!selStaff?.id || !selAssignedRole?.id) {
    //         console.log('Staff or role is not selected: profile=,', selStaff, ', role=', selAssignedRole);
    //         return;
    //     }

    //     let api = apiRef.current;
    //     if (!api) {
    //         return;
    //     }

    //     let saveFn = async () => {
    //         let data = await ApiUtils.getApiData({
    //             api: api.unlinkStaffRoles(selStaff.id, [selAssignedRole]),
    //             name: 'unlinkStaffRoles',
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

    const staffsHeader = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Available staffs</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" value={search} onInput={(e) => setSearch((e.target as HTMLInputElement).value)} placeholder="Search..." />
            </span>
        </div>
    );

    const linkedDeptsHeader = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Member of departments</h5>
        </div>
    );

    return (
        <>
            <Toast ref={toastRef} />
            {busy && <ProgressSpinner className="page-spinner" />}
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <StaffsTbl header={staffsHeader} search={search} selection={selStaff} reload={reload} onSelect={(e) => setSelStaff(e.value)} />
                        <div className="py-3 flex justify-content-end">
                            <Button label="New Staff" icon="pi pi-plus" onClick={_onNewStaff} />
                            <Button label="Delete" icon="pi pi-times" className="ml-2" onClick={_onDelete} />
                        </div>

                        <TabView>
                            <TabPanel header="General">
                                <div className="grid">
                                    <div className="col-12 lg:col-6">
                                        <StaffForm staff={selStaff} onAction={_onStaffFormAction} />
                                    </div>
                                    <div className="col-12 lg:col-6">{selStaff?.id && <DeptsTbl header={linkedDeptsHeader} byStaff={selStaff} />}</div>
                                </div>
                            </TabPanel>
                        </TabView>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Staffs;
