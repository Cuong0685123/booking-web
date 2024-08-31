import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Subject } from 'rxjs';

import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';

import { AppUtils, UiUtils } from '@/booking/service';
import { ApiUtils } from '@/booking/service/ApiUtil';
import { BookingApi } from '@/booking/service/BookingApi';
import { ApiErrInfo, ApiProps, EvtHandler, TblColRender } from '@/types/booking';

interface SuppliersTblProps {
    selection?: any;
    selectionMode?: string;
    search?: any;
    header?: any;
    reload?: boolean;
    onSelect?: EvtHandler;
    onAction?: EvtHandler;
}

interface FetchSuppliersOpts {
    search?: any;
    start?: any;
    limit?: any;
    sortMeta?: any[];
}

const SuppliersTbl = (props: SuppliersTblProps) => {
    const conf = useSelector((state: any) => state.settings);
    const auth = useSelector((state: any) => state.auth);
    const { tzOffset } = auth;
    const apiRef = useRef<BookingApi>();
    const toastRef = useRef<Toast>(null);

    const [suppliersTblData, setSuppliersTblData] = useState<any[]>([]);
    const [suppliersTblStart, setSuppliersTblStart] = useState<any>(0);
    const [suppliersTblLimit, setSuppliersTblLimit] = useState<any>(10);
    const [suppliersTblNbRows, setSuppliersTblNbRows] = useState<any>(0);
    const [selSupplier, setSelSupplier] = useState<any>();
    const [selSuppliers, setSelSuppliers] = useState<any[]>([]);
    const [sortMeta, setSortMeta] = useState<any[]>([]);
    const [sortField, setSortField] = useState<any>();
    const [sortOrder, setSortOrder] = useState<any>(1);

    const initSubjRef = useRef<Subject<any>>();

    const { search, selection, reload, header } = props;
    const selMode = props.selectionMode || 'single';

    useEffect(() => {
        let apiProps: ApiProps = {
            ...conf,
            token: auth?.token
        };
        let api = new BookingApi(apiProps);
        apiRef.current = api;
    }, [conf, auth]);

    useEffect(() => {
        let subj = new Subject<any>();
        initSubjRef.current = subj;
        return () => {
            subj.complete();
        };
    }, []);

    useEffect(() => {
        // console.log('init selection', selection);
        if (selection) {
            if (selMode === 'single') {
                setSelSupplier({ ...selection });
            } else {
                setSelSuppliers([...selection]);
            }
        } else {
            if (selMode === 'single') {
                setSelSupplier(null);
            } else {
                setSelSuppliers([]);
            }
        }
    }, [selection, selMode]);

    const _errHandler = useCallback((errInf: ApiErrInfo) => {
        UiUtils.showError({
            ...errInf,
            toast: toastRef.current
        });
    }, []);

    const _fetchSuppliers = useCallback(
        async (opts: FetchSuppliersOpts) => {
            let api = apiRef.current;
            if (!api) {
                return null;
            }
            let { search, start, limit, sortMeta } = opts;
            let filters = {};
            let params: any = {};

            let joins: any[] = [];

            // if (byStaff?.id) {
            //     filters = {
            //         ...filters,
            //         byMachine: 'exists (select 1 from MachineStaffLnk lnk where lnk.machine.id = obj.id and lnk.staff.id = :byStaffId)'
            //     };
            //     params = {
            //         ...params,
            //         byStaffId: {
            //             type: 'long',
            //             value: byStaff?.id
            //         }
            //     };
            // }

            // if (notByStaff?.id) {
            //     filters = {
            //         ...filters,
            //         byMachine: 'not exists (select 1 from MachineStaffLnk lnk where lnk.machine.id = obj.id and lnk.staff.id = :notByStaffId)'
            //     };
            //     params = {
            //         ...params,
            //         notByStaffId: {
            //             type: 'long',
            //             value: notByStaff?.id
            //         }
            //     };
            // }

            // let sorts = ['-obj.invDate', '-obj.createdAt'];
            sortMeta = sortMeta || [];
            let sorts = sortMeta.map((sm) => {
                return sm.order > 0 ? sm.field : `-${sm.field}`;
            });
            if (sorts.length < 1) {
                sorts = ['obj.name'];
            }
            // console.log('sorts', sorts);

            let data = await ApiUtils.getApiData({
                api: api.supplierList({ search, start, limit, filters, params, joins, sorts }),
                name: 'supplierList',
                errHandler: _errHandler
            });

            return data;
        },
        [_errHandler]
    );

    const _init = useCallback(
        async (opts: any) => {
            let data = await _fetchSuppliers(opts);
            if (!data) {
                setSuppliersTblNbRows(0);
                setSuppliersTblData([]);
                return;
            }
            let { count, list } = data;
            setSuppliersTblNbRows(count);
            setSuppliersTblData([...list]);
        },
        [_fetchSuppliers]
    );

    useEffect(() => {
        let subj = initSubjRef.current;
        if (!subj) {
            return;
        }
        let sub = subj.asObservable().subscribe({
            next: (data: any) => _init(data)
        });
        console.log('Subcribe init action');
        return () => {
            sub.unsubscribe();
        };
    }, [_init]);

    useEffect(() => {
        let subj = initSubjRef.current;
        if (!subj) {
            return;
        }
        let data = {
            search,
            start: suppliersTblStart,
            limit: suppliersTblLimit,
            sortMeta
        };
        // console.log('Fire init event', data);
        subj.next(data);
    }, [search, selection, reload, suppliersTblStart, suppliersTblLimit, sortMeta]);

    const _onSupplierSelected = (evt: any) => {
        if (selMode === 'single') {
            setSelSupplier({ ...evt.value });
        } else {
            setSelSuppliers([...evt.value]);
        }
        let { onSelect } = props;
        onSelect && onSelect(evt);
    };

    const _onPaging = (evt: any) => {
        // console.log('Paging event', evt);
        setSuppliersTblStart(evt.first);
        setSuppliersTblLimit(evt.rows);
    };

    const _onSort = (evt: any) => {
        // console.log('sort event', evt);
        // Process multisort
        // let newMeta = [...evt.multiSortMeta];
        // let sortFds = newMeta.map((sm) => sm.field);
        // for (let sm of sortMeta) {
        //   if (!sortFds.includes(sm.field)) {
        //     sortFds.push(sm.field);
        //     newMeta.push(sm);
        //   }
        // }
        // setSortMeta([...newMeta]);

        //Single sort
        let newMeta = sortMeta.filter((sm) => sm.field !== evt.sortField);
        newMeta = [
            {
                field: evt.sortField,
                order: evt.sortOrder
            },
            ...newMeta
        ];
        // console.log('new sort meta: ', newMeta);
        setSortField(evt.sortField);
        setSortOrder(evt.sortOrder);
        setSortMeta(newMeta);
    };

    const _renderCrCol: TblColRender = (row) => {
        let { createdAt } = row;
        if (createdAt) {
            return `${AppUtils.reFmtDate(createdAt, 'DD/MM/YY HH:mm', { offset: tzOffset })}`;
        }
    };

    const _renderUpCol: TblColRender = (row) => {
        let { updatedAt } = row;
        if (updatedAt) {
            return `${AppUtils.reFmtDate(updatedAt, 'DD/MM/YY HH:mm', { offset: tzOffset })}`;
        }
    };

    return (
        <>
            <Toast ref={toastRef} />
            {selMode === 'single' && (
                <DataTable
                    header={header}
                    value={suppliersTblData}
                    dataKey="id"
                    lazy={true}
                    paginator={true}
                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                    rows={suppliersTblLimit}
                    rowsPerPageOptions={[5, 10, 25]}
                    first={suppliersTblStart}
                    totalRecords={suppliersTblNbRows}
                    resizableColumns={true}
                    columnResizeMode="expand"
                    selectionMode="single"
                    selection={selSupplier}
                    onSelectionChange={_onSupplierSelected}
                    onPage={_onPaging}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    onSort={_onSort}
                >
                    <Column field="code" header="Supp. No." headerStyle={{ width: 120 }} sortable sortField="obj.code" />
                    <Column field="name" header="Name" headerStyle={{ width: 200 }} sortable sortField="obj.name" />
                    <Column field="description" header="Description" headerStyle={{ width: 300 }} />
                    <Column body={_renderCrCol} header="Created On" headerStyle={{ width: 130 }} headerClassName="text-right" bodyClassName="text-right" sortable sortField="obj.createdAt" />
                    <Column field="createdBy" header="Created By" headerStyle={{ width: 150 }} sortable sortField="obj.createdBy" />
                    <Column body={_renderUpCol} header="Updated On" headerStyle={{ width: 130 }} headerClassName="text-right" bodyClassName="text-right" sortable sortField="obj.updatedAt" />
                    <Column field="updatedBy" header="Updated By" headerStyle={{ width: 150 }} sortable sortField="obj.updatedBy" />
                    <Column field="id" header="#" headerClassName="text-right" bodyClassName="text-right" style={{ width: 90 }} />
                </DataTable>
            )}
            {selMode !== 'single' && (
                <DataTable
                    header={header}
                    value={suppliersTblData}
                    dataKey="id"
                    lazy={true}
                    paginator={true}
                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                    rows={suppliersTblLimit}
                    rowsPerPageOptions={[5, 10, 25]}
                    first={suppliersTblStart}
                    totalRecords={suppliersTblNbRows}
                    resizableColumns={true}
                    columnResizeMode="expand"
                    selection={selSuppliers}
                    onSelectionChange={_onSupplierSelected}
                    onPage={_onPaging}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    onSort={_onSort}
                >
                    <Column selectionMode="multiple" headerStyle={{ width: 50 }}></Column>
                    <Column field="code" header="Supp. No." headerStyle={{ width: 120 }} sortable sortField="obj.code" />
                    <Column field="name" header="Name" headerStyle={{ width: 200 }} sortable sortField="obj.name" />
                    <Column field="description" header="Description" headerStyle={{ width: 300 }} />
                    <Column body={_renderCrCol} header="Created On" headerStyle={{ width: 130 }} headerClassName="text-right" bodyClassName="text-right" sortable sortField="obj.createdAt" />
                    <Column field="createdBy" header="Created By" headerStyle={{ width: 150 }} sortable sortField="obj.createdBy" />
                    <Column body={_renderUpCol} header="Updated On" headerStyle={{ width: 130 }} headerClassName="text-right" bodyClassName="text-right" sortable sortField="obj.updatedAt" />
                    <Column field="updatedBy" header="Updated By" headerStyle={{ width: 150 }} sortable sortField="obj.updatedBy" />
                    <Column field="id" header="#" headerClassName="text-right" bodyClassName="text-right" style={{ width: 90 }} />
                </DataTable>
            )}
        </>
    );
};

export default SuppliersTbl;
