'use client';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import React, { useState } from 'react';
import type { Page } from '@/types';
import { Password } from 'primereact/password';
import { useRouter } from 'next/navigation';
import { register } from '@/booking/service/AuthService'; // Import hàm đăng ký

const Register: Page = () => {
    const [name, setName] = useState<string>(''); // Trạng thái cho tên
    const [email, setEmail] = useState<string>(''); // Trạng thái cho email
    const [phone, setPhone] = useState<string>(''); // Trạng thái cho số điện thoại
    const [username, setUsername] = useState<string>(''); // Trạng thái cho username
    const [password, setPassword] = useState<string>(''); // Trạng thái cho password
    const [confirmPassword, setConfirmPassword] = useState<string>(''); // Trạng thái cho xác nhận password
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // Trạng thái cho lỗi
    const router = useRouter();

    // Hàm xử lý đăng ký
    const handleRegister = async () => {
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }

        try {
            const response = await register(name, phone, email, username, password); // Gửi cả số điện thoại
            console.log('Registration successful:', response);
            router.push('/auth/mainpage'); // Chuyển hướng sau khi đăng ký thành công
        } catch (error: any) {
            console.error('Registration error:', error);
            setErrorMessage(error.message || 'Registration failed. Please try again.');
        }
    };

    // Hàm xử lý quay lại trang đăng nhập
    const navigateToLogin = () => {
        router.push('/auth/login');
    };

    return (
        <>
            <div className="h-screen flex w-full surface-ground">
                <div className="flex flex-1 flex-column surface-ground align-items-center justify-content-center">
                    <div className="w-11 sm:w-30rem">
                        <div className="flex flex-column">
                            <div style={{ height: '56px', width: '56px' }} className="bg-primary-50 border-circle flex align-items-center justify-content-center">
                                <i className="pi pi-users text-primary text-4xl"></i>
                            </div>
                            <div className="mt-4">
                                <h1 className="m-0 text-primary font-semibold text-4xl">Join us!</h1>
                                <span className="block text-700 mt-2">Please fill the fields to sign-up for the Ultima network</span>
                            </div>
                        </div>
                        <div className="flex flex-column gap-3 mt-6">
                            {/* Hiển thị lỗi nếu có */}
                            {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

                            {/* Input Name */}
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-user"></i>
                                </span>
                                <InputText placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>

                            {/* Input Email */}
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-at"></i>
                                </span>
                                <InputText placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>

                            {/* Input Phone */}
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-phone"></i>
                                </span>
                                <InputText placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                            </div>

                            {/* Input Username */}
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-user-edit"></i>
                                </span>
                                <InputText placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                            </div>

                            {/* Input Password */}
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-key"></i>
                                </span>
                                <Password placeholder="Password" className="w-full" toggleMask value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>

                            {/* Input Confirm Password */}
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-key"></i>
                                </span>
                                <Password placeholder="Confirm Password" className="w-full" toggleMask value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                            </div>

                            {/* Nút đăng ký */}
                            <div>
                                <Button className="w-full" label="SIGN UP" onClick={handleRegister}></Button>
                            </div>

                            {/* Nút quay lại đăng nhập */}
                            <div>
                                <Button className="w-full text-primary-500" text label="BACK TO LOGIN" onClick={navigateToLogin}></Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ảnh nền bên phải */}
                <div
                    style={{
                        backgroundImage: 'url(/layout/images/pages/accessDenied-bg.jpg)'
                    }}
                    className="hidden lg:flex flex-1 align-items-center justify-content-center bg-cover"
                >
                    <img src="/layout/images/logo/vector_logo.png" alt="" />
                </div>
            </div>
        </>
    );
};

export default Register;
