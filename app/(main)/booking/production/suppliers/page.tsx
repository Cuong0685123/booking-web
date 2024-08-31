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
import { ProductionApi } from '@/rs/service/ProductionApi';
import { ProgressSpinner } from 'primereact/progressspinner';
import SuppliersTbl from '@/rs/components/production/SuppliersTbl';
import SupplierForm from '@/rs/components/production/SupplierForm';

interface SuppliersProps {}

const Suppliers = (props: SuppliersProps) => {
    const conf = useSelector((state: any) => state.settings);
    const auth = useSelector((state: any) => state.auth);

    const [search, setSearch] = useState<string>('');
    const [selSupplier, setSelSupplier] = useState<any>({});
    const [reload, setReload] = useState<boolean>(false);
    const [busy, setBusy] = useState<any>(false);

    const apiRef = useRef<ProductionApi>();
    const toastRef = useRef<Toast>(null);

    useEffect(() => {
        let apiProps: ApiProps = {
            ...conf,
            token: auth?.token
        };
        let api = new ProductionApi(apiProps);
        apiRef.current = api;
    }, [conf, auth]);

    const _errHandler = useCallback((errInf: ApiErrInfo) => {
        UiUtils.showError({
            ...errInf,
            toast: toastRef.current
        });
    }, []);

    const _onNewSupplier = (evt: any) => {
        setSelSupplier({});
    };

    const _onSupplierFormAction = (evt: any) => {
        setReload(!reload);
    };

    const _onDelete = async (evt: any) => {
        if (!selSupplier?.id) {
            console.log('no Supplier selected');
            return;
        }

        let saveFn = async () => {
            let api = apiRef.current;
            if (!api) {
                return;
            }
            setBusy(true);
            let data = await ApiUtils.getApiData({
                api: api.supplierDelete(selSupplier.id),
                name: 'supplierDelete',
                errHandler: _errHandler
            });
            setBusy(false);
            if (!data) {
                return;
            }
            setSelSupplier({});
            UiUtils.showInfo({
                detail: 'Success',
                toast: toastRef.current
            });
            setReload(!reload);
        };

        let header = 'Confirmation';
        let message = 'Are you sure to delete selected supplier?';
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

    const deptsHeader = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Available suppliers</h5>
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
                        <SuppliersTbl header={deptsHeader} search={search} selection={selSupplier} reload={reload} onSelect={(e) => setSelSupplier(e.value)} />
                        <div className="py-3 flex justify-content-end">
                            <Button label="New Supplier" icon="pi pi-plus" onClick={_onNewSupplier} />
                            <Button label="Delete" icon="pi pi-times" className="ml-2" onClick={_onDelete} />
                        </div>
                        <TabView>
                            <TabPanel header="General">
                                <div className="grid">
                                    <div className="col-12 lg:col-6">
                                        <SupplierForm supplier={selSupplier} onAction={_onSupplierFormAction} />
                                    </div>
                                </div>
                            </TabPanel>
                            {/* <TabPanel header="Staff">{selSupplier?.id && <SupplierStaffTab dept={selSupplier} />}</TabPanel> */}
                        </TabView>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Suppliers;
