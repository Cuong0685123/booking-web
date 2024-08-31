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
import { AssetApi } from '@/rs/service/AssetApi';
import { ProgressSpinner } from 'primereact/progressspinner';
import ReportTplsTbl from '@/rs/components/report-tpl/ReportTplsTbl';
import ReportTplForm from '@/rs/components/report-tpl/ReportTplForm';
import ReportTpls from '@/rs/components/report-tpl/ReportTpls';
import { Panel } from 'primereact/panel';

interface PageProps {}

const ReportTplsPage = (props: PageProps) => {
    // const conf = useSelector((state: any) => state.settings);
    // const auth = useSelector((state: any) => state.auth);

    // const [search, setSearch] = useState<string>('');
    const [selReportTpl, setSelReportTpl] = useState<any>({});
    // const [reload, setReload] = useState<boolean>(false);
    const [busy, setBusy] = useState<any>(false);

    // const apiRef = useRef<AssetApi>();
    const toastRef = useRef<Toast>(null);

    // useEffect(() => {
    //     let apiProps: ApiProps = {
    //         ...conf,
    //         token: auth?.token
    //     };
    //     let api = new AssetApi(apiProps);
    //     apiRef.current = api;
    // }, [conf, auth]);

    // const _errHandler = useCallback((errInf: ApiErrInfo) => {
    //     UiUtils.showError({
    //         ...errInf,
    //         toast: toastRef.current
    //     });
    // }, []);

    const _onRootTplsAction: EvtHandler = (evt) => {
        let { type, value } = evt;
        if (type === 'reportTplSelected') {
            console.log('root // selReportTpl', value);
            setSelReportTpl(value);
            return;
        }
        if (type === 'reportTplDeleted') {
            setSelReportTpl({});
            return;
        }
    };

    const _onSubTplsAction: EvtHandler = (evt) => {
        let { type, value } = evt;
        if (type === 'reportTplSelected') {
            console.log('sub // selReportTpl', value);
            // setSelReportTpl(value);
        }
    };

    return (
        <>
            <Toast ref={toastRef} />
            {busy && <ProgressSpinner className="page-spinner" />}
            <ReportTpls header="Available templates" isRoot={true} onAction={_onRootTplsAction} />
            {selReportTpl?.id && (
                <Panel header="Sub templates" className="mt-3">
                    <ReportTpls header="Available sub templates" masterTpl={selReportTpl} onAction={_onSubTplsAction} />
                </Panel>
            )}
        </>
    );
};

export default ReportTplsPage;
