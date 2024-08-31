'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'primereact/button';
// import { InputText } from 'primereact/inputtext';
// import { TabPanel, TabView } from 'primereact/tabview';
import { Toast } from 'primereact/toast';

import { AppApi, AppUtils, UiUtils } from '@/rs/service';
import { ApiErrInfo, ApiProps, NoArgFn } from '@/types/booking';
import { ApiUtils } from '@/rs/service/ApiUtil';
import { confirmDialog } from 'primereact/confirmdialog';
// import { ProductionApi } from '@/rs/service/ProductionApi';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Panel } from 'primereact/panel';
import { Calendar } from 'primereact/calendar';
// import { Dropdown } from 'primereact/dropdown';
// import { InputNumber } from 'primereact/inputnumber';

interface HomeProps {}

const Home = (props: HomeProps) => {
    const conf = useSelector((state: any) => state.settings);
    const auth = useSelector((state: any) => state.auth);

    // const [search, setSearch] = useState<string>('');
    const [busy, setBusy] = useState<any>(false);
    const [byMonth, setByMonth] = useState<any>(null);
    // const [byYear, setByYear] = useState<any>(null);
    // const [selReportType, setSelReportType] = useState<any>({});
    // const [reportTypeOpts, setReportTypeOpts] = useState<any[]>([]);
    // const [periodTypeOpts, setPeriodTypeOpts] = useState<any[]>([]);
    const [selPeriodType, setSelPeriodType] = useState<any>({});

    const apiRef = useRef<AppApi>();
    const toastRef = useRef<Toast>(null);

    // const isSummary = selReportType.code === 'summary';
    // const isMonthly = isSummary || selPeriodType?.name === 'MONTH';
    // const isYearly = !isSummary && selPeriodType?.name === 'YEAR';

    useEffect(() => {
        let newVal = new Date();
        newVal = AppUtils.addMonths(newVal, -1);
        setByMonth(newVal);
        // let opts: any[] = [
        //     {
        //         code: 'summary',
        //         name: '01-diesel-usage-summary-excel',
        //         label: 'Summary'
        //     },
        //     {
        //         code: 'detail',
        //         name: '02-disel-usage-dlt-by-dept',
        //         label: 'Detail'
        //     }
        // ];
        // setReportTypeOpts(opts);
        // setSelReportType(opts[0]);

        // opts = [
        //     {
        //         name: 'MONTH',
        //         label: 'MONTH',
        //         nameLbl: 'MONTHLY'
        //     },
        //     {
        //         name: 'YEAR',
        //         label: 'YEAR',
        //         nameLbl: 'YEARLY'
        //     }
        // ];

        // setPeriodTypeOpts(opts);
        // setSelPeriodType(opts[0]);

        // let inf = AppUtils.getDateInfo(new Date());
        // setByYear(inf?.year || 2000);
    }, []);

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

    const _validateSummaryRepOptions: NoArgFn<any> = async () => {
        if (!AppUtils.isDate(byMonth)) {
            UiUtils.showError({ detail: 'Please select month', toast: toastRef.current });
            return false;
        }
        let params = {};
        // let repName = selReportType?.name;
        let repName = '0201-attendance-monthly-rep';
        params = {
            ...params,
            // month: {
            //     type: 'date',
            //     value: AppUtils.jsDateToStr(byMonth)
            // },
            // tzOffset,
            // periodType: {
            //     type: 'enum:com.exy.rocstar.model.PeriodType',
            //     value: 'MONTH'
            // },
            periodDt: {
                type: 'date',
                value: AppUtils.jsDateToStr(byMonth)
            },
            periodValLbl: AppUtils.jsDateToStr(byMonth, 'MM/YYYY')
        };
        let extraOpts = {
            dsBeanName: 'monthlyAttendRep',
            dsMethod: 'loadMainRows'
        };
        let res = {
            name: repName,
            params,
            extra: { ...extraOpts },
            format: 'xlsx'
        };
        return res;
    };

    const _validateOptions = async () => {
        return await _validateSummaryRepOptions();
    };

    const _onExecReport = async (evt: any) => {
        let opts: any = await _validateOptions();
        if (!opts) {
            return;
        }
        let execFn = async () => {
            let api = apiRef.current;
            if (!api) {
                return;
            }
            setBusy(true);
            let data = await ApiUtils.getApiData({
                api: api.generateReport(opts),
                name: 'generateReport',
                errHandler: _errHandler
            });
            setBusy(false);
            if (!data) {
                return;
            }
            console.log('Exec report result', data);

            let extFiles: any[] = data?.ext?.files__ ?? [];
            console.log('ext files: ', extFiles);
            extFiles.forEach((extFile) => {
                let api = apiRef.current;
                if (!api) {
                    return;
                }
                let uri = api.getDownloadUrl(`__working__/${extFile}`);
                AppUtils.downloadFile(uri);
            });

            let { filePath } = data;
            let uri = `__working__/${filePath}`;
            uri = api.getDownloadUrl(uri);
            AppUtils.downloadFile(uri);
            UiUtils.showInfo({
                detail: 'Success',
                toast: toastRef.current
            });
        };

        let header = 'Confirmation';
        let message = 'Are you sure to generate report?';
        confirmDialog({
            header,
            message,
            acceptIcon: 'pi pi-check',
            rejectIcon: 'pi pi-times',
            accept: () => {
                execFn();
            },
            reject: () => {}
        });
    };

    return (
        <>
            <Toast ref={toastRef} />
            {busy && <ProgressSpinner className="page-spinner" />}
            <Panel header="Attendance Monthly Report">
                <div className="grid p-fluid mt-2">
                    {/* <div className="field col-12 lg:col-3">
                        <span className="p-float-label">
                            <Dropdown
                                value={selReportType}
                                onChange={(e) => {
                                    console.log('Report change evt', e);
                                    setSelReportType(e.value);
                                }}
                                options={reportTypeOpts}
                                dataKey="code"
                                optionLabel="label"
                                placeholder="Select"
                            />
                            <label>Report type</label>
                        </span>
                    </div> */}
                    {/* {!isSummary && (
                        <div className="field col-12 lg:col-3">
                            <span className="p-float-label">
                                <Dropdown
                                    value={selPeriodType}
                                    onChange={(e) => {
                                        // console.log('Period type changed evt', e);
                                        setSelPeriodType(e.value);
                                    }}
                                    options={periodTypeOpts}
                                    dataKey="name"
                                    optionLabel="label"
                                    placeholder="Select"
                                />
                                <label>Period type:</label>
                            </span>
                        </div>
                    )} */}
                    <div className="field col-12 lg:col-3">
                        <span className="p-float-label">
                            <Calendar
                                showIcon
                                showButtonBar
                                dateFormat="mm/yy"
                                value={byMonth}
                                onChange={(e) => {
                                    setByMonth(e.value ?? null);
                                }}
                            />
                            <label>Select Month</label>
                        </span>
                    </div>
                    {/* {isYearly && (
                        <div className="field col-12 lg:col-3">
                            <span className="p-float-label">
                                <InputNumber
                                    value={byYear}
                                    showButtons
                                    mode="decimal"
                                    min={2000}
                                    max={9999}
                                    onValueChange={(e) => setByYear(e.value)}
                                ></InputNumber>
                                <label>Year</label>
                            </span>
                        </div>
                    )} */}
                </div>
                <div className="flex justify-content-end">
                    <Button label="Execute" icon="pi pi-check" disabled={busy} onClick={_onExecReport} />
                </div>
            </Panel>
        </>
    );
};

export default Home;
