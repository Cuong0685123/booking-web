import axios from 'axios';

const BASE_URL = 'http://localhost:8000'; // URL of your backend

// Function to add a hotel
export const addHotel = async (hotelData: any) => {
    try {
        const token = localStorage.getItem('token');
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        const response = await axios.post(`${BASE_URL}/hotels/add`, hotelData, config);
        return response.data;
    } catch (error: any) {
        handleError(error);
    }
};

// Function to get all hotels
export const getAllHotels = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/hotels/all`);
        return response.data;
    } catch (error: any) {
        handleError(error);
    }
};

// Function to get a hotel by ID
export const getHotelById = async (id: number) => {
    try {
        const response = await axios.get(`${BASE_URL}/hotels/${id}`);
        return response.data;
    } catch (error: any) {
        handleError(error);
    }
};

// Function to update a hotel
export const updateHotel = async (id: number, hotelData: any) => {
    try {
        const token = localStorage.getItem('token');
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        const response = await axios.put(`${BASE_URL}/hotels/update/${id}`, hotelData, config);
        return response.data;
    } catch (error: any) {
        handleError(error);
    }
};

// Function to delete a hotel
export const deleteHotel = async (id: number) => {
    try {
        const token = localStorage.getItem('token');
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        const response = await axios.delete(`${BASE_URL}/hotels/delete/${id}`, config);
        return response.data;
    } catch (error: any) {
        handleError(error);
    }
};

// Function to get rooms by hotel ID
export const getRoomsByHotelId = async (hotelId: number) => {
    try {
        const response = await axios.get(`${BASE_URL}/hotels/${hotelId}/rooms`);
        return response.data;
    } catch (error: any) {
        handleError(error);
    }
};

// Helper function to handle errors
const handleError = (error: any) => {
    if (error.response) {
        throw error.response.data;
    } else if (error.request) {
        throw new Error('No response from server. Please try again later.');
    } else {
        throw new Error(error.message || 'An unknown error occurred.');
    }
};
