'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import { confirmDialog } from 'primereact/confirmdialog';
import { InputText } from 'primereact/inputtext';
import { TabPanel, TabView } from 'primereact/tabview';
import { Toast } from 'primereact/toast';

import RoleForm from '@/rs/components/system/RoleForm';
import RolesTbl from '@/rs/components/system/RolesTbl';
import { AppApi, UiUtils } from '@/rs/service';
import { ApiUtils } from '@/rs/service/ApiUtil';
import { ApiErrInfo, ApiProps } from '@/types/booking';
import PermissionsTbl from '@/rs/components/system/PermissionsTbl';

interface UsersProps {}

const Users = (props: UsersProps) => {
    const conf = useSelector((state: any) => state.settings);
    const auth = useSelector((state: any) => state.auth);

    const [search, setSearch] = useState<string>('');
    const [selRole, setSelRole] = useState<any>({});
    const [reload, setReload] = useState<boolean>(false);
    const [permsReload, setRoleReload] = useState<boolean>(false);
    const [selAssignedPerm, setSelAssignedPerm] = useState<any>(false);
    const [selAvaiPerm, setSelAvaiPerm] = useState<any>(false);

    const apiRef = useRef<AppApi>();
    const toastRef = useRef<Toast>(null);

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

    useEffect(() => {
        setSelAvaiPerm({});
        setSelAssignedPerm({});
    }, [selRole]);

    const _onNewRole = (evt: any) => {
        setSelRole({});
    };

    const _onRoleFormAction = (evt: any) => {
        setReload(!reload);
    };

    const _onAssignPerm = async (evt: any) => {
        if (!selRole?.id || !selAvaiPerm?.id) {
            console.log('Role or permission is not selected: role=,', selRole, ', perm=', selAvaiPerm);
            return;
        }

        let saveFn = async () => {
            let api = apiRef.current;
            if (!api) {
                return;
            }
            let data = await ApiUtils.getApiData({
                api: api.linkRolePerms(selRole.id, [selAvaiPerm]),
                name: 'linkRolePerms',
                errHandler: _errHandler
            });
            if (!data) {
                return;
            }
            UiUtils.showInfo({
                detail: 'Success',
                toast: toastRef.current
            });
            setSelAvaiPerm({});
            setRoleReload(!permsReload);
        };

        let header = 'Confirmation';
        let message = 'Are you sure to assign selected permission to current role?';
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

    const _onRevokePerm = (evt: any) => {
        if (!selRole?.id || !selAssignedPerm?.id) {
            console.log('Role or permission is not selected: role=,', selRole, ', perm=', selAssignedPerm);
            return;
        }

        let saveFn = async () => {
            let api = apiRef.current;
            if (!api) {
                return;
            }
            let data = await ApiUtils.getApiData({
                api: api.unlinkRolePerms(selRole.id, [selAssignedPerm]),
                name: 'unlinkRolePerms',
                errHandler: _errHandler
            });
            if (!data) {
                return;
            }
            UiUtils.showInfo({
                detail: 'Success',
                toast: toastRef.current
            });
            setSelAvaiPerm({});
            setRoleReload(!permsReload);
        };

        let header = 'Confirmation';
        let message = 'Are you sure to assign selected permission to current role?';
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

    return (
        <>
            <Toast ref={toastRef} />
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 className="m-0">Available roles</h5>
                            <span className="block mt-2 md:mt-0 p-input-icon-left">
                                <i className="pi pi-search" />
                                <InputText type="search" value={search} onInput={(e) => setSearch((e.target as HTMLInputElement).value)} placeholder="Search..." />
                            </span>
                        </div>
                        <RolesTbl search={search} selection={selRole} reload={reload} onSelect={(e) => setSelRole(e.value)} />
                        <div className="py-3 flex justify-content-end">
                            <Button label="New Role" icon="pi pi-plus" onClick={_onNewRole} />
                        </div>

                        <TabView>
                            <TabPanel header="General">
                                <div className="grid">
                                    <div className="col-12 lg:col-6">
                                        <RoleForm role={selRole} onAction={_onRoleFormAction} />
                                    </div>
                                    <div className="col-12 lg:col-6"></div>
                                </div>
                            </TabPanel>
                            <TabPanel header="Access Control">
                                {selRole?.id && (
                                    <div className="grid">
                                        <div className="col-12 lg:col-6">
                                            <PermissionsTbl byRoleCode={selRole.code} reload={permsReload} selection={selAssignedPerm} onSelect={(evt) => setSelAssignedPerm(evt.value)} />
                                            <div className="py-3 flex justify-content-end">
                                                <Button label="Revoke" icon="pi pi-times" disabled={!selAssignedPerm?.id} onClick={_onRevokePerm} />
                                            </div>
                                        </div>
                                        <div className="col-12 lg:col-6">
                                            <PermissionsTbl notByRoleCode={selRole.code} reload={permsReload} selection={selAvaiPerm} onSelect={(evt) => setSelAvaiPerm(evt.value)} />
                                            <div className="py-3 flex justify-content-end">
                                                <Button label="Assign" icon="pi pi-link" disabled={!selAvaiPerm?.id} onClick={_onAssignPerm} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </TabPanel>
                        </TabView>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Users;
