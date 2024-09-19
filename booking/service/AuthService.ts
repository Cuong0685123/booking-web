import axios from 'axios';

const BASE_URL = 'http://localhost:8000'; // URL của backend

// Phương thức đăng nhập
export const login = async (username: string, password: string) => {
    try {
        const response = await axios.post(`${BASE_URL}/login`, {
            username,
            password
        });
        return response.data;
    } catch (error: any) {
        if (error.response) {
            // Lỗi từ phía server và có response
            throw error.response.data;
        } else if (error.request) {
            // Yêu cầu đã gửi nhưng không nhận được phản hồi
            throw new Error('No response from server. Please try again later.');
        } else {
            // Lỗi xảy ra trước khi yêu cầu được gửi
            throw new Error(error.message || 'An unknown error occurred.');
        }
    }
};

// Phương thức đăng ký
export const register = async (name: string, phone: string, email: string, username: string, password: string) => {
    try {
        const response = await axios.post(`${BASE_URL}/register`, {
            name,
            phone,
            email,
            account: {
                username,
                password
            }
        });
        return response.data;
    } catch (error: any) {
        if (error.response) {
            // Lỗi từ phía server và có response
            throw error.response.data;
        } else if (error.request) {
            // Yêu cầu đã gửi nhưng không nhận được phản hồi
            throw new Error('No response from server. Please try again later.');
        } else {
            // Lỗi xảy ra trước khi yêu cầu được gửi
            throw new Error(error.message || 'An unknown error occurred.');
        }
    }
};
