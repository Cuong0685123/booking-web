'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { TabPanel, TabView } from 'primereact/tabview';
import { Toast } from 'primereact/toast';

import PublicHolidayForm from '@/rs/components/organization/PublicHolidayForm';
import PublicHolidaysTbl from '@/rs/components/organization/PublicHolidaysTbl';
import { AppUtils, UiUtils } from '@/rs/service';
import { ApiErrInfo, ApiProps } from '@/types/booking';
import { ApiUtils } from '@/rs/service/ApiUtil';
import { confirmDialog } from 'primereact/confirmdialog';
import { AttendApi } from '@/rs/service/AttendApi';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputNumber } from 'primereact/inputnumber';

interface PublicHolidaysProps {}

const PublicHolidays = (props: PublicHolidaysProps) => {
    const conf = useSelector((state: any) => state.settings);
    const auth = useSelector((state: any) => state.auth);

    const [search, setSearch] = useState<string>('');
    const [selHoliday, setSelHoliday] = useState<any>({});
    const [reload, setReload] = useState<boolean>(false);
    const [busy, setBusy] = useState<any>(false);
    const [byYear, setByYear] = useState<any>(0);

    const apiRef = useRef<AttendApi>();
    const toastRef = useRef<Toast>(null);

    useEffect(() => {
        let apiProps: ApiProps = {
            ...conf,
            token: auth?.token
        };
        let api = new AttendApi(apiProps);
        apiRef.current = api;
    }, [conf, auth]);

    useEffect(() => {
        let now = new Date();
        let year = AppUtils.getDateInfo(now).year;
        setByYear(year);
    }, []);

    const _errHandler = useCallback((errInf: ApiErrInfo) => {
        UiUtils.showError({
            ...errInf,
            toast: toastRef.current
        });
    }, []);

    const _onNewHoliday = (evt: any) => {
        setSelHoliday({});
    };

    const _onHolidayFormAction = (evt: any) => {
        setReload(!reload);
    };

    const _onDelete = async (evt: any) => {
        if (!selHoliday?.id) {
            console.log('no PublicHoliday selected');
            return;
        }

        let saveFn = async () => {
            let api = apiRef.current;
            if (!api) {
                return;
            }
            setBusy(true);
            let data = await ApiUtils.getApiData({
                api: api.publicHolidayDelete(selHoliday.id),
                name: 'publicHolidayDelete',
                errHandler: _errHandler
            });
            setBusy(false);
            if (!data) {
                return;
            }
            setSelHoliday({});
            UiUtils.showInfo({
                detail: 'Success',
                toast: toastRef.current
            });
            setReload(!reload);
        };

        let header = 'Confirmation';
        let message = 'Are you sure to delete selected holiday?';
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
    //     if (!selHoliday?.id || !selAvaiRole?.id) {
    //         console.log('PublicHoliday or role is not selected: profile=,', selHoliday, ', role=', selAvaiRole);
    //         return;
    //     }

    //     let api = apiRef.current;
    //     if (!api) {
    //         return;
    //     }

    //     let saveFn = async () => {
    //         let data = await ApiUtils.getApiData({
    //             api: api.linkPublicHolidayRoles(selHoliday.id, [selAvaiRole]),
    //             name: 'linkPublicHolidayRoles',
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
    //     if (!selHoliday?.id || !selAssignedRole?.id) {
    //         console.log('PublicHoliday or role is not selected: profile=,', selHoliday, ', role=', selAssignedRole);
    //         return;
    //     }

    //     let api = apiRef.current;
    //     if (!api) {
    //         return;
    //     }

    //     let saveFn = async () => {
    //         let data = await ApiUtils.getApiData({
    //             api: api.unlinkPublicHolidayRoles(selHoliday.id, [selAssignedRole]),
    //             name: 'unlinkPublicHolidayRoles',
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

    const termsHeader = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Available public holidays</h5>
            <div className="flex flex-row">
                <span className="p-float-label">
                    <InputNumber value={byYear} onValueChange={(e) => setByYear(e.value ?? 0)} showButtons mode="decimal"></InputNumber>
                    <label>Year</label>
                </span>
                <span className="block mt-2 md:mt-0 p-input-icon-left ml-2">
                    <i className="pi pi-search" />
                    <InputText type="search" value={search} onInput={(e) => setSearch((e.target as HTMLInputElement).value)} placeholder="Search..." />
                </span>
            </div>
        </div>
    );

    return (
        <>
            <Toast ref={toastRef} />
            {busy && <ProgressSpinner className="page-spinner" />}
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <PublicHolidaysTbl header={termsHeader} search={search} byYear={byYear} selection={selHoliday} reload={reload} onSelect={(e) => setSelHoliday(e.value)} />
                        <div className="py-3 flex justify-content-end">
                            <Button label="New Holiday" icon="pi pi-plus" onClick={_onNewHoliday} />
                            <Button label="Delete" icon="pi pi-times" className="ml-2" onClick={_onDelete} />
                        </div>
                        <TabView>
                            <TabPanel header="General">
                                <div className="grid">
                                    <div className="col-12 lg:col-6">
                                        <PublicHolidayForm holiday={selHoliday} onAction={_onHolidayFormAction} />
                                    </div>
                                </div>
                            </TabPanel>
                        </TabView>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PublicHolidays;
