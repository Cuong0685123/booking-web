'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import { confirmDialog } from 'primereact/confirmdialog';
import { InputText } from 'primereact/inputtext';
import { TabPanel, TabView } from 'primereact/tabview';
import { Toast } from 'primereact/toast';

import ProfileForm from '@/rs/components/system/ProfileForm';
import ProfilePwdForm from '@/rs/components/system/ProfilePwdForm';
import RolesTbl from '@/rs/components/system/RolesTbl';
import UsersTbl from '@/rs/components/system/UsersTbl';
import { AppApi, UiUtils } from '@/rs/service';
import { ApiUtils } from '@/rs/service/ApiUtil';
import { ApiErrInfo, ApiProps } from '@/types/booking';

interface UsersProps {}

const Users = (props: UsersProps) => {
    const conf = useSelector((state: any) => state.settings);
    const auth = useSelector((state: any) => state.auth);

    const [search, setSearch] = useState<string>('');
    const [selProfile, setSelProfile] = useState<any>({});
    const [reload, setReload] = useState<boolean>(false);
    const [rolesReload, setRoleReload] = useState<boolean>(false);
    const [selAssignedRole, setSelAssignedRole] = useState<any>(false);
    const [selAvaiRole, setSelAvaiRole] = useState<any>(false);

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
        setSelAvaiRole({});
        setSelAssignedRole({});
    }, [selProfile]);

    const _onNewProfile = (evt: any) => {
        setSelProfile({});
    };

    const _onProfileFormAction = (evt: any) => {
        setReload(!reload);
    };

    const _onAssignRole = async (evt: any) => {
        if (!selProfile?.id || !selAvaiRole?.id) {
            console.log('Profile or role is not selected: profile=,', selProfile, ', role=', selAvaiRole);
            return;
        }

        let saveFn = async () => {
            let api = apiRef.current;
            if (!api) {
                return;
            }
            let data = await ApiUtils.getApiData({
                api: api.linkProfileRoles(selProfile.id, [selAvaiRole]),
                name: 'linkProfileRoles',
                errHandler: _errHandler
            });
            if (!data) {
                return;
            }
            UiUtils.showInfo({
                detail: 'Success',
                toast: toastRef.current
            });
            setSelAvaiRole({});
            setRoleReload(!rolesReload);
        };

        let header = 'Confirmation';
        let message = 'Are you sure to assign selected role to current user?';
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

    const _onRevokeRole = (evt: any) => {
        if (!selProfile?.id || !selAssignedRole?.id) {
            console.log('Profile or role is not selected: profile=,', selProfile, ', role=', selAssignedRole);
            return;
        }

        let saveFn = async () => {
            let api = apiRef.current;
            if (!api) {
                return;
            }
            let data = await ApiUtils.getApiData({
                api: api.unlinkProfileRoles(selProfile.id, [selAssignedRole]),
                name: 'unlinkProfileRoles',
                errHandler: _errHandler
            });
            if (!data) {
                return;
            }
            UiUtils.showInfo({
                detail: 'Success',
                toast: toastRef.current
            });
            setSelAvaiRole({});
            setRoleReload(!rolesReload);
        };

        let header = 'Confirmation';
        let message = 'Are you sure to assign selected role to current user?';
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
                            <h5 className="m-0">Available users</h5>
                            <span className="block mt-2 md:mt-0 p-input-icon-left">
                                <i className="pi pi-search" />
                                <InputText type="search" value={search} onInput={(e) => setSearch((e.target as HTMLInputElement).value)} placeholder="Search..." />
                            </span>
                        </div>
                        <UsersTbl search={search} selection={selProfile} reload={reload} onSelect={(e) => setSelProfile(e.value)} />
                        <div className="py-3 flex justify-content-end">
                            <Button label="New User" icon="pi pi-plus" onClick={_onNewProfile} />
                        </div>

                        <TabView>
                            <TabPanel header="General">
                                <div className="grid">
                                    <div className="col-12 lg:col-6">
                                        <ProfileForm profile={selProfile} onAction={_onProfileFormAction} />
                                    </div>
                                    <div className="col-12 lg:col-6">{selProfile?.id && <ProfilePwdForm profile={selProfile} />}</div>
                                </div>
                            </TabPanel>
                            <TabPanel header="Access Control">
                                {selProfile?.id && (
                                    <div className="grid">
                                        <div className="col-12 lg:col-6">
                                            <RolesTbl byLogin={selProfile.login} reload={rolesReload} selection={selAssignedRole} onSelect={(evt) => setSelAssignedRole(evt.value)} />
                                            <div className="py-3 flex justify-content-end">
                                                <Button label="Revoke" icon="pi pi-times" disabled={!selAssignedRole?.id} onClick={_onRevokeRole} />
                                            </div>
                                        </div>
                                        <div className="col-12 lg:col-6">
                                            <RolesTbl notByLogin={selProfile.login} reload={rolesReload} selection={selAvaiRole} onSelect={(evt) => setSelAvaiRole(evt.value)} />
                                            <div className="py-3 flex justify-content-end">
                                                <Button label="Assign" icon="pi pi-link" disabled={!selAvaiRole?.id} onClick={_onAssignRole} />
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
