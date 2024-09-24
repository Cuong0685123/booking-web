import axios from 'axios';

const BASE_URL = 'http://localhost:8000'; // Your backend URL

export const createBooking = async (bookingData: any) => {
    try {
        const response = await axios.post(`${BASE_URL}/bookings`, bookingData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`, // Pass the token if required
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error; // Rethrow the error for handling in the component
    }
};


// Function to get booking by ID
export const getBookingById = async (id: number) => {
    try {
        const token = localStorage.getItem('token');
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        const response = await axios.get(`${BASE_URL}/bookings/${id}`, config);
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
