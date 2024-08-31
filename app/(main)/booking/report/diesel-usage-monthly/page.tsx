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
import { ProductionApi } from '@/rs/service/ProductionApi';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Panel } from 'primereact/panel';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
// import { InputNumber } from 'primereact/inputnumber';
import { AutoComplete } from 'primereact/autocomplete';

interface HomeProps {}

const Home = (props: HomeProps) => {
    const conf = useSelector((state: any) => state.settings);
    const auth = useSelector((state: any) => state.auth);
    const { tzOffset } = auth;
    // const [search, setSearch] = useState<string>('');
    const [busy, setBusy] = useState<any>(false);
    const [byMonth, setByMonth] = useState<any>(null);
    const [byYear, setByYear] = useState<any>(null);
    const [fromDate, setFromDate] = useState<any>(null);
    const [toDate, setToDate] = useState<any>(null);
    const [selReportType, setSelReportType] = useState<any>({});
    const [reportTypeOpts, setReportTypeOpts] = useState<any[]>([]);
    // const [periodTypeOpts, setPeriodTypeOpts] = useState<any[]>([]);
    // const [selPeriodType, setSelPeriodType] = useState<any>({});
    const [lineSuggestions, setLineSuggestions] = useState<any[]>([]);
    const [selLine, setSelLine] = useState<any>({});

    const apiRef = useRef<AppApi>();
    const prodApiRef = useRef<ProductionApi>();
    const toastRef = useRef<Toast>(null);

    const isSummary = selReportType.code === 'summary';
    // const isMonthly = isSummary || selPeriodType?.name === 'MONTH';
    // const isYearly = !isSummary && selPeriodType?.name === 'YEAR';

    useEffect(() => {
        let newVal = new Date();
        newVal = AppUtils.addMonths(newVal, -1);
        setByMonth(newVal);
        let opts: any[] = [
            {
                code: 'summary',
                name: '0101-diesel-usage-summary-excel',
                label: 'Summary',
                dataSourceMethod: 'loadMainRows'
            },
            {
                code: 'detail-type-1',
                name: '0102-disel-usage-dlt-type-1',
                label: 'Detail Type 1',
                dataSourceMethod: 'loadType1MainRows'
            },
            {
                code: 'detail-type-2',
                name: '0103-disel-usage-dlt-type-2',
                label: 'Detail Type 2',
                dataSourceMethod: 'loadType2MainRows'
            }
        ];
        setReportTypeOpts(opts);
        setSelReportType(opts[0]);

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

        let inf = AppUtils.getDateInfo(new Date());
        setByYear(inf?.year || 2000);

        let now = new Date();
        setToDate(now);

        let prvMon = AppUtils.addMonths(now, -1);
        prvMon = AppUtils.setDateInfo(prvMon, 'date', 1);
        console.log('prvMon', prvMon);
        setFromDate(prvMon);
    }, []);

    useEffect(() => {
        let apiProps: ApiProps = {
            ...conf,
            token: auth?.token
        };
        let api = new AppApi(apiProps);
        apiRef.current = api;
        let prodApi = new ProductionApi(apiProps);
        prodApiRef.current = prodApi;
    }, [conf, auth]);

    const _errHandler = useCallback((errInf: ApiErrInfo) => {
        UiUtils.showError({
            ...errInf,
            toast: toastRef.current
        });
    }, []);

    const _fetchFacLines = useCallback(
        async (opts: any) => {
            let { search } = opts;
            let start = 0;
            let limit = 1000;
            let api = prodApiRef.current;
            if (!api) {
                return null;
            }
            let filters = {};
            let joins: any[] = [];
            let params = {};
            let sorts = ['+obj.name'];
            return await ApiUtils.getApiData({
                api: api?.facLineList({ search, filters, joins, params, sorts, start, limit }),
                name: 'facLineList',
                errHandler: _errHandler
            });
        },
        [_errHandler]
    );

    const _validateSummaryRepOptions: NoArgFn<any> = async () => {
        if (!AppUtils.isDate(byMonth)) {
            UiUtils.showError({ detail: 'Please select month', toast: toastRef.current });
            return false;
        }
        let params = {};
        let repName = selReportType?.name;
        params = {
            ...params,
            month: {
                type: 'date',
                value: AppUtils.jsDateToStr(byMonth)
            },
            tzOffset,
            periodType: {
                type: 'enum:com.exy.rocstar.model.PeriodType',
                value: 'MONTH'
            },
            periodDate: {
                type: 'date',
                value: AppUtils.jsDateToStr(byMonth)
            }
        };
        let extraOpts = {
            dsBeanName: 'dieselSummaryRep',
            dsMethod: 'loadMainSummaryRows'
        };
        let res = {
            name: repName,
            params,
            extra: { ...extraOpts },
            format: 'xlsx'
        };
        return res;
    };

    const _validateDetailRepOptions: NoArgFn<any> = async () => {
        let repName = selReportType?.name;
        let params: any = {
            tzOffset
        };
        // console.log('tzOffset', tzOffset);
        let hasFrom = AppUtils.isDate(fromDate);
        if (!hasFrom) {
            UiUtils.showError({
                detail: 'Please select start period',
                toast: toastRef.current
            });
            return false;
        }
        let hasTo = AppUtils.isDate(toDate);
        let fromDtLbl = '';
        let toDtLbl = '';
        if (AppUtils.isDate(fromDate)) {
            let fromDt = AppUtils.truncDate(fromDate, 'date');
            fromDtLbl = AppUtils.jsDateToStr(fromDt, 'DD/MM/YYYY');
            params = {
                ...params,
                fromDt: {
                    type: 'date',
                    value: AppUtils.jsDateToStr(fromDate, 'YYYY-MM-DD') + ' 00:00:00'
                }
            };
        }
        if (AppUtils.isDate(toDate)) {
            let toDt = AppUtils.addDays(toDate, 1);
            toDtLbl = AppUtils.jsDateToStr(toDate, 'DD/MM/YYYY');
            params = {
                ...params,
                toDt: {
                    type: 'date',
                    value: AppUtils.jsDateToStr(toDt, 'YYYY-MM-DD') + ' 00:00:00'
                }
            };
        }
        let periodLbl = '';
        if (hasFrom && hasTo) {
            periodLbl = `Period From: ${fromDtLbl} To ${toDtLbl}`;
        } else if (hasFrom) {
            periodLbl = `Period From: ${fromDtLbl}`;
        } else if (hasTo) {
            periodLbl = `Period To ${toDtLbl}`;
        }
        params = {
            ...params,
            periodLbl
        };
        if (selLine?.id) {
            params = {
                ...params,
                lineId: {
                    type: 'long',
                    value: selLine?.id || 0
                }
            };
        }
        let typeCode = selReportType.code;
        let extraOpts = {
            dsBeanName: 'dieselDetailRep',
            dsMethod: selReportType?.dataSourceMethod
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
        if (!selReportType?.code) {
            UiUtils.showError({
                detail: 'Please select report type',
                toast: toastRef.current
            });
            return false;
        }
        let typeCode = selReportType.code;
        switch (typeCode) {
            case 'summary':
                return await _validateSummaryRepOptions();
            case 'detail-type-1':
            case 'detail-type-2':
                return await _validateDetailRepOptions();
            default:
                UiUtils.showError({
                    detail: 'Invalid report type: ' + typeCode,
                    toast: toastRef.current
                });
                return false;
        }
    };

    const _onSuggestLines = async (evt: any) => {
        let search = evt?.query ?? '';
        let data = await _fetchFacLines({ search });
        let lst = data?.list ? [...data.list] : [];
        lst = lst.map((it) => {
            return {
                ...it,
                label: `${it?.code} :: ${it?.name}`
            };
        });
        setLineSuggestions([...lst]);
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
            <Panel header="Diesel Usage Monthly Report">
                <div className="grid p-fluid mt-2">
                    <div className="field col-12 lg:col-3">
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
                    </div>
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
                    {isSummary && (
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
                    )}
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
                    {!isSummary && (
                        <div className="field col-12 lg:col-3">
                            <span className="p-float-label">
                                <Calendar
                                    showIcon
                                    showButtonBar
                                    dateFormat="dd/mm/yy"
                                    value={fromDate}
                                    onChange={(e) => {
                                        setFromDate(e.value ?? null);
                                    }}
                                />
                                <label>From Date</label>
                            </span>
                        </div>
                    )}
                    {!isSummary && (
                        <div className="field col-12 lg:col-3">
                            <span className="p-float-label">
                                <Calendar
                                    showIcon
                                    showButtonBar
                                    dateFormat="dd/mm/yy"
                                    value={toDate}
                                    onChange={(e) => {
                                        setToDate(e.value ?? null);
                                    }}
                                />
                                <label>To Date</label>
                            </span>
                        </div>
                    )}
                    {!isSummary && (
                        <div className="field col-12 lg:col-3">
                            <span className="p-float-label">
                                <AutoComplete placeholder="Production Line" dropdown value={selLine} field="label" onChange={(e) => setSelLine(e.value)} suggestions={lineSuggestions} completeMethod={_onSuggestLines} />
                                <label>Line</label>
                            </span>
                        </div>
                    )}
                </div>
                <div className="flex justify-content-end">
                    <Button label="Execute" icon="pi pi-check" disabled={busy} onClick={_onExecReport} />
                </div>
            </Panel>
        </>
    );
};

export default Home;
