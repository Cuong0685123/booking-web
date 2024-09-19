'use client';
import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Page } from '../../../../types/layout';
import { login } from '@/booking/service/AuthService';

const Login: Page = () => {
    const [username, setUsername] = useState<string>(''); // Trạng thái cho username
    const [password, setPassword] = useState<string>(''); // Trạng thái cho password
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // Trạng thái hiển thị lỗi
    const [loading, setLoading] = useState<boolean>(false); // Trạng thái khi đang load
    const router = useRouter();

    const handleLogin = async () => {
        setLoading(true);
        setErrorMessage(null);
    
        try {
            // Call the login API
            const response = await login(username, password);
            console.log("API response: ", response); // Log the full response
    
            // Ensure the response is in the expected format
            if (response?.data?.token) {
                localStorage.setItem('token', response.data.token);
                console.log("Token saved: ", localStorage.getItem('token'));
    
                // Save the entered username directly
                localStorage.setItem('username', username);
                console.log("Username saved: ", localStorage.getItem('username'));
    
                // Handle additional data if needed
                // Adjust based on API response if necessary
                localStorage.setItem('role', response.data.role || '');
    
                // Redirect to the main page
                router.push('/auth/mainpage');
            } else {
                // Show error if no token is present
                setErrorMessage('Login failed. Invalid credentials or missing data.');
            }
        } catch (error: any) {
            console.error("Login error: ", error); // Log detailed error
            const errMsg = error?.response?.data?.message || 'Login failed. Please try again.';
            setErrorMessage(errMsg);
        } finally {
            setLoading(false);
        }
    };
    
    

    // Hàm chuyển hướng tới dashboard
    const navigateToDashboard = () => {
        router.push('/');
    };

    // Hàm chuyển hướng tới trang đăng ký
    const navigateToRegister = () => {
        router.push('/auth/register'); // Chuyển hướng tới trang đăng ký
    };

    return (
        <div className="h-screen flex flex-column bg-cover" style={{ backgroundImage: 'url(/layout/images/pages/login-bg.jpg)' }}>
            {/* Header */}
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

            {/* Form đăng nhập */}
            <div className="align-self-center mt-auto mb-auto">
                <div className="text-center z-5 flex flex-column border-1 border-round-md surface-border surface-card px-3">
                    <div className="-mt-5 text-white bg-cyan-700 border-round-md mx-auto px-3 py-1 border-1 surface-border">
                        <h2 className="m-0">LOGIN</h2>
                    </div>

                    <h4>Welcome</h4>

                    <div className="text-color-secondary mb-6 px-6">Please use the form to sign-in</div>

                    {/* Hiển thị lỗi nếu có */}
                    {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

                    {/* Input form */}
                    <div className="w-full flex flex-column gap-3 px-3 pb-6">
                        <span className="p-input-icon-left">
                            <i className="pi pi-user"></i>
                            <InputText 
                                className="w-full" 
                                placeholder="Username" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                            />
                        </span>

                        <span className="p-input-icon-left">
                            <i className="pi pi-key"></i>
                            <InputText 
                                type="password" 
                                className="w-full" 
                                placeholder="Password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                        </span>

                        {/* Nút đăng nhập */}
                        <Button 
                            className="w-full my-3 px-3" 
                            label={loading ? 'Logging in...' : 'LOGIN'} 
                            disabled={loading} 
                            onClick={handleLogin}
                        ></Button>

                        {/* Nút đăng ký */}
                        <Button 
                            className="w-full my-3 px-3 p-button-secondary" 
                            label="SIGN UP" 
                            onClick={navigateToRegister}
                        ></Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
