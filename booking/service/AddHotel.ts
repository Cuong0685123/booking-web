import axios from 'axios';

const BASE_URL = 'http://localhost:8000'; // URL of your backend

export const addHotel = async (hotelData: any) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/hotels`, hotelData); // Adjust the endpoint if needed
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw error.response.data;
        } else if (error.request) {
            throw new Error('No response from server. Please try again later.');
        } else {
            throw new Error(error.message || 'An unknown error occurred.');
        }
    }
};
