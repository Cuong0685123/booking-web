'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { TabPanel, TabView } from 'primereact/tabview';
import { Toast } from 'primereact/toast';

import { UiUtils } from '@/rs/service';
import { ApiErrInfo, ApiProps, EvtHandler } from '@/types/booking';
import { ApiUtils } from '@/rs/service/ApiUtil';
import { confirmDialog } from 'primereact/confirmdialog';
import { AttendApi } from '@/rs/service/AttendApi';
import { ProgressSpinner } from 'primereact/progressspinner';
import AttendImpsTbl from '@/rs/components/attendance/AttendImpsTbl';
import { Panel } from 'primereact/panel';
import { FileUpload } from 'primereact/fileupload';
import AttendRecsTbl from '@/rs/components/attendance/AttendRecsTbl';
import AttendRecFilter from '@/rs/components/attendance/AttendRecFilter';
import { AutoComplete } from 'primereact/autocomplete';

interface AttendImpsProps {}

const defAttRecFilter = {
    empName: '',
    deptName: '',
    search: '',
    attDateFrom: null,
    attDateTo: null
};

const AttendImps = (props: AttendImpsProps) => {
    const conf = useSelector((state: any) => state.settings);
    const auth = useSelector((state: any) => state.auth);

    const [search, setSearch] = useState<string>('');
    const [selAttendImp, setSelAttendImp] = useState<any>({});
    const [uploadUrl, setUploadUrl] = useState<any>('');
    const [attRecFilter, setAttRecFilter] = useState<any>({ ...defAttRecFilter });
    const [selTerminal, setSelTerminal] = useState<any>({});
    const [terminalsSuggestions, setTerminalSuggestions] = useState<any[]>([]);

    const [reload, setReload] = useState<boolean>(false);
    const [busy, setBusy] = useState<any>(false);

    const apiRef = useRef<AttendApi>();
    const toastRef = useRef<Toast>(null);

    useEffect(() => {
        let apiProps: ApiProps = {
            ...conf,
            token: auth?.token
        };
        let api = new AttendApi(apiProps);
        apiRef.current = api;

        let url = api.attendImpUploadUrl();
        setUploadUrl(url);
    }, [conf, auth]);

    const _errHandler = useCallback((errInf: ApiErrInfo) => {
        UiUtils.showError({
            ...errInf,
            toast: toastRef.current
        });
    }, []);

    const _fetchTerminals = useCallback(
        async (opts: any) => {
            let { search } = opts;
            let start = 0;
            let limit = 1000;
            let api = apiRef.current;
            if (!api) {
                console.log('Api not ready');
                return null;
            }
            let filters = {};
            let joins: any[] = [];
            let params = {};
            let sorts = ['+obj.name'];
            return await ApiUtils.getApiData({
                api: api.attendTerminalList({ search, filters, joins, params, sorts, start, limit }),
                name: 'attendTerminalList',
                errHandler: _errHandler
            });
        },
        [_errHandler]
    );

    const _onSuggestTerminals: EvtHandler = async (evt: any) => {
        let search = evt?.query ?? '';
        let data = await _fetchTerminals({ search });
        let lst = data?.list ? [...data.list] : [];
        lst = lst.map((it) => {
            return {
                ...it,
                label: `${it?.code} :: ${it?.name}`
            };
        });
        setTerminalSuggestions([...lst]);
    };

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
                api: api.attendImpDelete(selAttendImp.id),
                name: 'attendImpDelete',
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
        let message = 'Are you sure to delete selected attendance import?';
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

    const _onBeforeUploadFile: EvtHandler = (event: any) => {
        console.log('before upload event', event);
        let { xhr, formData } = event;
        console.log('xhr', xhr);
        console.log('formData', formData);
        formData.append('terminalId', selTerminal?.id || 0);
    };

    const _onBeforeSendFile: EvtHandler = (event: any) => {
        console.log('before send event', event);
        let { xhr } = event;
        xhr.setRequestHeader('token', auth.token);
        // xhr.setRequestHeader('Content-Type', 'multipart/form-data');
        setBusy(true);
    };

    const _onUploadDone: EvtHandler = (event: any) => {
        console.log('Upload done', event);
        setBusy(false);
        setReload(!reload);
        setSelAttendImp({});
        let { xhr } = event;
        if (!xhr || xhr.status !== 200) {
            UiUtils.showError({
                detail: 'Failed to upload attendance data',
                toast: toastRef.current
            });
            return;
        }

        let resp = JSON.parse(xhr.response);
        let { errors } = resp;
        if (errors && errors.length > 0) {
            UiUtils.showError({ errors, toast: toastRef.current });
            return;
        }

        UiUtils.showInfo({ detail: 'Upload success', toast: toastRef.current });
        // let { onAction } = props;
        // setTimeout(() => {
        //     onAction &&
        //         onAction({
        //             type: 'fileUploaded'
        //         });
        // }, 0);
    };

    const _onUploadError: EvtHandler = (event: any) => {
        console.log('Upload error', event);
    };

    const _onAttendRecFilterChanged: EvtHandler = (evt: any) => {
        if (evt) {
            let newFil = { ...attRecFilter, ...evt };
            setAttRecFilter(newFil);
        }
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
                <div className="col-12 xl:col-8">
                    <div className="card">
                        <AttendImpsTbl header={tblHeader} search={search} selection={selAttendImp} reload={reload} onSelect={(e) => setSelAttendImp(e.value)} />
                        <div className="py-3 flex justify-content-end">
                            <Button
                                label="Clear Seledction"
                                icon="pi pi-eraser"
                                className="ml-2"
                                onClick={(e) => {
                                    setSelAttendImp({});
                                }}
                            />
                            <Button label="Delete" icon="pi pi-times" className="ml-2" onClick={_onDelete} />
                        </div>
                    </div>
                </div>
                <div className="col-12 xl:col-4">
                    <Panel header="Upload">
                        <div className="py-3">
                            <div className="grid p-fluid">
                                <div className="field col-12">
                                    <span className="p-float-label">
                                        <AutoComplete
                                            placeholder="Search"
                                            dropdown
                                            value={selTerminal}
                                            field="label"
                                            onChange={(e) => {
                                                setSelTerminal(e.value);
                                            }}
                                            suggestions={terminalsSuggestions}
                                            completeMethod={_onSuggestTerminals}
                                        />
                                        <label>Attendance Terminal</label>
                                    </span>
                                </div>
                            </div>
                            <form>
                                <div className="from-group">
                                    <FileUpload
                                        name="file"
                                        mode="basic"
                                        chooseLabel="Select CSV File"
                                        url={uploadUrl}
                                        onBeforeSend={_onBeforeSendFile}
                                        onBeforeUpload={_onBeforeUploadFile}
                                        onUpload={_onUploadDone}
                                        onError={_onUploadError}
                                    ></FileUpload>
                                </div>
                            </form>
                        </div>
                    </Panel>
                </div>
            </div>
            <div className="py-2">
                <TabView>
                    <TabPanel header="Imported records">
                        <div>
                            <AttendRecFilter onChanged={_onAttendRecFilterChanged} />
                            <AttendRecsTbl byImpSrc={selAttendImp} byEmpName={attRecFilter?.empName} byDeptName={attRecFilter?.deptName} attDateFrom={attRecFilter?.attDateFrom} attDateTo={attRecFilter?.attDateTo} />
                        </div>
                    </TabPanel>
                    {/* <TabPanel header="Staff">{selAttendImp?.id && <AttendImpStaffTab dept={selAttendImp} />}</TabPanel> */}
                </TabView>
            </div>
        </>
    );
};

export default AttendImps;
