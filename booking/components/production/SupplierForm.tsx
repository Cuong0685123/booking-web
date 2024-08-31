import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';

import { Toast } from 'primereact/toast';
import { Panel } from 'primereact/panel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
// import { Dialog } from 'primereact/dialog';
// import { Checkbox } from 'primereact/checkbox';
import { confirmDialog } from 'primereact/confirmdialog';

import { ApiErrInfo, ApiProps, EvtHandler } from '@/types/booking';
import { AppUtils, UiUtils } from '@/booking/service';
import { ApiUtils } from '@/booking/service/ApiUtil';
import { InputTextarea } from 'primereact/inputtextarea';
// import { Dropdown } from 'primereact/dropdown';
import { ProgressSpinner } from 'primereact/progressspinner';
import { BookingApi } from '@/booking/service/BookingApi';

interface Props {
    supplier: any;
    onAction?: EvtHandler;
}

const defSupplier = {
    __cls__: 'com.tc.booking.model.entity.Supplier',
    flag: 0,
    code: '',
    name: '',
    description: ''
};

const SupplierForm = (props: Props) => {
    const conf = useSelector((state: any) => state.settings);
    const auth = useSelector((state: any) => state.auth);

    const { supplier } = props;
    const [editSupplier, setEditSupplier] = useState<any>();
    // const [showCfmDlg, setShowCfmDlg] = useState<any>(false);
    // const [statusOpts, setStatusOpts] = useState<any[]>([]);
    const [busy, setBusy] = useState<any>(false);

    const toastRef = useRef<any>();
    const apiRef = useRef<BookingApi>();

    useEffect(() => {
        let apiProps: ApiProps = {
            ...conf,
            token: auth.token
        };
        let api = new BookingApi(apiProps);
        apiRef.current = api;
        // console.log('setup api done', api);
    }, [conf, auth]);

    // useEffect(() => {
    //     let stats = ['ACTIVE', 'INACTIVE'];
    //     let opts = stats.map((it) => {
    //         return {
    //             label: it,
    //             value: it
    //         };
    //     });
    //     setStatusOpts([...opts]);
    // }, []);

    useEffect(() => {
        // console.log('Effect // init supplier', supplier);
        let newSt = {
            ...defSupplier,
            ...supplier
        };
        setEditSupplier(newSt);
    }, [supplier]);

    const _errHandler = useCallback((errInf: ApiErrInfo) => {
        UiUtils.showError({
            ...errInf,
            toast: toastRef.current
        });
    }, []);

    const _validateSupplier = async () => {
        console.log('validate editSupplier', editSupplier);
        let res = {
            ...editSupplier
        };
        if (res?.id && AppUtils.isEmpty(res?.code)) {
            UiUtils.showError({ detail: "Can't update supplier No. to empty value", toast: toastRef.current });
            return false;
        }
        return res;
    };

    const _onSave = async (evt: any) => {
        // setShowCfmDlg(false);
        // let saveSupplier = _validateSupplier();
        // if (!saveSupplier) {
        //     return;
        // }
        // let api: AppApi | undefined = apiRef.current;
        // if (!api) {
        //     return;
        // }

        let newObj = await _validateSupplier();
        if (!newObj) {
            return;
        }

        let savePf = async () => {
            let api = apiRef.current;
            if (!api) {
                return;
            }
            setBusy(true);
            let data = await ApiUtils.getApiData({
                api: api.supplierUpdate({ ...newObj }),
                name: 'supplierUpdate',
                errHandler: _errHandler
            });
            setBusy(false);
            if (!data) {
                return;
            }
            UiUtils.showInfo({ detail: 'Success', toast: toastRef.current });
            let { onAction } = props;
            setTimeout(() => {
                onAction &&
                    onAction({
                        type: 'supplierSaved',
                        value: { ...data?.entity }
                    });
            }, 0);
        };

        let isEdit = newObj?.id;

        confirmDialog({
            header: 'Confirmation',
            message: isEdit ? 'Are you sure to update supplier?' : 'Are you sure to create new supplier?',
            acceptIcon: 'pi pi-check',
            rejectIcon: 'pi pi-times',
            accept: () => {
                savePf();
            },
            reject: () => {
                console.log('User canceled');
            }
        });
    };

    // const cfmDlgFooter = (
    //     <div className="text-right">
    //         <Button label="Yes" icon="pi-md-check" onClick={_onSave} />
    //         <Button
    //             label="No"
    //             icon="pi-md-cancel"
    //             onClick={(e) => {
    //                 setShowCfmDlg(false);
    //             }}
    //         />
    //     </div>
    // );

    if (!editSupplier) {
        return null;
    }

    const saveLbl = editSupplier.id ? 'Update Supplier' : 'Create Supplier';
    const isEdit = !!editSupplier.id;
    return (
        <>
            <Toast ref={toastRef} />
            {busy && <ProgressSpinner className="page-spinner" />}
            <Panel header="Supplier details">
                <div className="grid p-fluid">
                    <div className="field col-12 lg:col-6">
                        <span className="p-float-label">
                            <InputText
                                value={editSupplier.code}
                                onInput={(e) => {
                                    setEditSupplier({
                                        ...editSupplier,
                                        code: (e.target as HTMLInputElement).value
                                    });
                                }}
                            />
                            <label>Supplier No.</label>
                        </span>
                    </div>

                    <div className="field col-12 lg:col-6">
                        <span className="p-float-label">
                            <InputText
                                value={editSupplier.name}
                                onInput={(e) => {
                                    setEditSupplier({
                                        ...editSupplier,
                                        name: (e.target as HTMLInputElement).value
                                    });
                                }}
                            />
                            <label>Name</label>
                        </span>
                    </div>

                    <div className="field col-12">
                        <span className="p-float-label">
                            <InputTextarea
                                value={editSupplier.description}
                                rows={5}
                                onInput={(e) => {
                                    setEditSupplier({
                                        ...editSupplier,
                                        description: (e.target as HTMLInputElement).value
                                    });
                                }}
                            />
                            <label>Description</label>
                        </span>
                    </div>
                </div>
            </Panel>

            <div className="flex justify-content-end pt-3">
                <Button label={saveLbl} icon="pi pi-check" disabled={busy} onClick={_onSave} />
            </div>
            {/* <Dialog
                header="Confirm save supplier"
                footer={cfmDlgFooter}
                visible={showCfmDlg}
                style={{ width: '400px' }}
                modal={true}
                onHide={() => {
                    setShowCfmDlg(false);
                }}
            >
                {editSupplier.id && <span>Are you sure to update supplier?</span>}
                {!editSupplier.id && <span>Are you sure to create supplier?</span>}
            </Dialog> */}
        </>
    );
};

export default SupplierForm;
