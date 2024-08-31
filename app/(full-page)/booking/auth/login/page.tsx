'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

import { Page } from '@/types/layout';
import { useDispatch, useSelector } from 'react-redux';
import { CoreApi, UiUtils } from '@/booking/service';
import { ApiErrInfo, ApiProps, EvtHandler } from '@/types/booking';
import { ApiUtils } from '@/booking/service/ApiUtil';
import { auth as authAction } from '@/booking/lib/features/auth/authSlice';

const Login: Page = () => {
    const router = useRouter();
    const settings = useSelector((state: any) => state.settings);
    const auth = useSelector((state: any) => state.auth);
    // const auth = useSelector((state: any) => state.auth);
    const dispatch = useDispatch();
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loginBtnDisabled, setLoginBtnDisabled] = useState<boolean>(false);

    const apiRef = useRef<CoreApi>();
    const toastRef = useRef<Toast>(null);

    useEffect(() => {
        if (auth.isAuth) {
            //Navigate to home page
            router.push('/');
        }
    }, [router, auth]);

    useEffect(() => {
        let props: ApiProps = {
            ...settings
        };
        // console.log('ApiProps', props);
        let api: CoreApi = new CoreApi(props);
        apiRef.current = api;
    }, [settings]);

    const _errHandler = useCallback((err: ApiErrInfo) => {
        UiUtils.showError({
            ...err,
            toast: toastRef.current
        });
    }, []);

    const navigateToDashboard = () => {
        router.push('/');
    };

    const _onKeyUp: EvtHandler = (evt: any) => {
        console.log('Key up', evt);
        if (evt?.keyCode === 13) {
            //trigger login
            setTimeout(() => {
                _onLogin(evt);
            }, 0);
        }
    };

    const _onLogin: EvtHandler = async (evt: any) => {
        let loginData = {
            username,
            password
        };
        // console.log('Process login data', loginData);
        let api: CoreApi | undefined = apiRef.current;
        if (!api) {
            UiUtils.showError({
                detail: 'Api is not ready',
                toast: toastRef.current
            });
            return;
        }
        setLoginBtnDisabled(true);
        let data = await ApiUtils.getApiData({
            api: api.login(loginData),
            name: 'login',
            errHandler: _errHandler
        });
        setLoginBtnDisabled(false);
        console.log('Got login data', data);
        if (data) {
            let authData = {
                username,
                lang: 'en',
                ...data
            };
            dispatch(authAction(authData));
        }
    };

    return (
        <>
            <Toast ref={toastRef} />
            <div className="h-screen flex flex-column bg-cover" style={{ backgroundImage: 'url(/layout/images/pages/login-bg.jpg)' }}>
                <div className="shadow-2 bg-indigo-500 z-5 p-3 flex justify-content-between flex-row align-items-center">
                    <div className="ml-3 flex" onClick={navigateToDashboard}>
                        <div>
                            <img className="h-2rem" src="/layout/images/logo/logo2x.png" alt="" />
                        </div>
                    </div>
                    <div className="mr-3 flex">
                        <Button onClick={navigateToDashboard} text className="p-button-plain text-white">
                            DASHBOARD
                        </Button>
                    </div>
                </div>

                <div className="align-self-center mt-auto mb-auto">
                    <div className="text-center z-5 flex flex-column border-1 border-round-md surface-border surface-card px-3">
                        <div className="-mt-5 text-white bg-cyan-700 border-round-md mx-auto px-3 py-1 border-1 surface-border">
                            <h2 className="m-0">LOGIN</h2>
                        </div>

                        <h4>Welcome to BOOKING</h4>

                        <div className="text-color-secondary mb-6 px-6">Please enter your user name and password</div>

                        <div className="w-full flex flex-column gap-3 px-3 pb-6">
                            <span className="p-input-icon-left">
                                <i className="pi pi-envelope"></i>
                                <InputText className="w-full" placeholder="Username" value={username} onChange={(e: any) => setUsername(e.target.value)} />
                            </span>

                            <span className="p-input-icon-left">
                                <i className="pi pi-key"></i>
                                <InputText type="password" className="w-full" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyUp={_onKeyUp} />
                            </span>
                            <Button className="w-full my-3 px-3" label="LOGIN" disabled={loginBtnDisabled} onClick={_onLogin}></Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
