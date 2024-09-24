'use client';

import { useState, useEffect } from 'react';
import { Calendar as PRCalendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { useRouter } from 'next/navigation';
import { getAllHotels, getRoomsByHotelId } from '@/booking/service/AddHotel';
import { createBooking } from '@/booking/service/BookingHotels'; // Import your createBooking service

// Define the types for hotels and rooms
type Hotel = {
    id: number;
    name: string;
};

type Room = {
    id: number;
    roomNumber: string;
};

const BookingPage = () => {
    // Define the state with proper types
    const [checkInDate, setCheckInDate] = useState<Date | null>(null);
    const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
    const [selectedHotel, setSelectedHotel] = useState<number | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
    const [hotels, setHotels] = useState<Hotel[]>([]); // Define the state type as an array of Hotel
    const [rooms, setRooms] = useState<Room[]>([]); // Define the state type as an array of Room
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        } else {
            router.push('/auth/login'); // Redirect to login if not logged in
        }

        // Fetch hotels on component mount
        const fetchHotels = async () => {
            try {
                const data = await getAllHotels();
                setHotels(data); // Assume data is an array of hotels
            } catch (error) {
                console.error('Failed to fetch hotels:', error);
            }
        };

        fetchHotels();
    }, [router]);

    // Fetch rooms when a hotel is selected
    const onHotelChange = async (hotelId: number) => {
        setSelectedHotel(hotelId); // hotelId is a number
        try {
            const roomData = await getRoomsByHotelId(hotelId);
            setRooms(roomData); // Assume roomData is an array of rooms
        } catch (error) {
            console.error('Failed to fetch rooms:', error);
        }
    };

    const handleBookingSubmit = async () => {
        if (!checkInDate || !checkOutDate || !selectedRoom || !selectedHotel) {
            alert('Please fill in all fields.');
            return;
        }

        const bookingData = {
            checkInDate: checkInDate, // Use the Date object directly
            checkOutDate: checkOutDate, // Use the Date object directly
            roomId: selectedRoom,
            hotelId: selectedHotel,
        };

        try {
            const response = await createBooking(bookingData); // Use the createBooking service
            if (response) {
                alert('Booking successful!');
                router.push('/auth/mainpage');
            } else {
                alert('Booking failed. Please try again.');
            }
        } catch (error) {
            console.error('Failed to create booking:', error);
            alert('An error occurred while booking.');
        }
    };

    return (
        <div className="booking-container p-5">
            <h2 className="text-3xl mb-4">Book a Room</h2>

            <div className="mb-3">
                <label className="block mb-1">Check-In Date:</label>
                <PRCalendar value={checkInDate} onChange={(e) => setCheckInDate(e.value as Date)} dateFormat="yy-mm-dd" />
            </div>

            <div className="mb-3">
                <label className="block mb-1">Check-Out Date:</label>
                <PRCalendar value={checkOutDate} onChange={(e) => setCheckOutDate(e.value as Date)} dateFormat="yy-mm-dd" />
            </div>

            <div className="mb-3">
                <label className="block mb-1">Select Hotel:</label>
                <Dropdown
                    value={selectedHotel}
                    options={hotels.map(h => ({ label: h.name, value: h.id }))}
                    onChange={(e) => onHotelChange(e.value)}
                    placeholder="Select a hotel"
                />
            </div>

            {selectedHotel && (
                <div className="mb-3">
                    <label className="block mb-1">Select Room:</label>
                    <Dropdown
                        value={selectedRoom}
                        options={rooms.map(r => ({ label: `Room ${r.roomNumber}`, value: r.id }))}
                        onChange={(e) => setSelectedRoom(e.value)}
                        placeholder="Select a room"
                    />
                </div>
            )}

            <Button label="Submit Booking" onClick={handleBookingSubmit} className="p-button-success" />
        </div>
    );
};

export default BookingPage;
