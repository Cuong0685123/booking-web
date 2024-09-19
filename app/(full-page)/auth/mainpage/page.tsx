'use client';

import { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Calendar as PRCalendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Rating } from 'primereact/rating';
import { Divider } from 'primereact/divider';
import { useRouter } from 'next/navigation'; // To handle navigation

const MainPage = () => {
    const [dates, setDates] = useState<(Date | null)[] | null>(null);
    const [guests, setGuests] = useState<number>(1);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const router = useRouter(); // Initialize router for navigation

    // Simulating fetching username from localStorage or backend
    useEffect(() => {
        const username = localStorage.getItem('username');
        if (username === 'admin') {
            setIsAdmin(true);
        }
    }, []);

    // Handling date change for PRCalendar
    const handleDateChange = (event: any) => {
        setDates(event.value);
    };

    // Handling guest number input change
    const handleGuestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const guestCount = +e.target.value;
        setGuests(guestCount > 0 ? guestCount : 1); // Ensure a minimum of 1 guest
    };

    const handleSearch = () => {
        console.log('Searching for rooms: Dates:', dates, 'Guests:', guests);
        // Add search logic here
    };

    const navigateToLogin = () => {
        router.push('/auth/login'); // Redirect to login page
    };

    const navigateToRegister = () => {
        router.push('/auth/register'); // Redirect to register page
    };

    const handleAddRoom = () => {
        // Logic to handle adding a room
        console.log('Adding a new room');
    };

    const handleEditRoom = () => {
        // Logic to handle editing a room
        console.log('Editing a room');
    };

    const handleDeleteRoom = () => {
        // Logic to handle deleting a room
        console.log('Deleting a room');
    };

    return (
        <div>
            {/* Navigation Bar */}
            <div className="p-3 shadow-2 flex justify-content-end align-items-center bg-gray-900">
                <Button label="Login" className="p-button-text text-white mr-2" onClick={navigateToLogin} />
                <Button label="Sign Up" className="p-button-outlined p-button-light" onClick={navigateToRegister} />
                {isAdmin && (
                    <div className="flex gap-2">
                        <Button label="Add Room" icon="pi pi-plus" className="p-button-success" onClick={handleAddRoom} />
                        <Button label="Edit Room" icon="pi pi-pencil" className="p-button-warning" onClick={handleEditRoom} />
                        <Button label="Delete Room" icon="pi pi-trash" className="p-button-danger" onClick={handleDeleteRoom} />
                    </div>
                )}
            </div>

            {/* Hero Section */}
            <div
                className="p-5 text-center"
                style={{
                    backgroundImage: 'url(/hero-banner.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: 'white',
                }}
            >
                <h1 className="text-5xl mb-4">Find Your Perfect Hotel</h1>
                <p className="text-lg mb-5">Search from thousands of rooms in hotels around the world.</p>

                <div className="flex gap-3 justify-content-center align-items-center mt-4">
                    <PRCalendar
                        value={dates}
                        onChange={handleDateChange}
                        selectionMode="range"
                        placeholder="Select Dates"
                        showIcon
                    />

                    <InputText
                        type="number"
                        value={guests.toString()}
                        onChange={handleGuestChange}
                        placeholder="Guests"
                        min={1}
                    />

                    <Button label="Search Rooms" className="p-button-warning" onClick={handleSearch} />
                </div>
            </div>

            {/* Featured Rooms */}
            <div className="p-5">
                <h2 className="text-center text-4xl mb-5">Featured Rooms</h2>
                <div className="grid grid-nogutter">
                    <div className="col-12 md:col-4">
                        <Card
                            title="Luxury Suite"
                            subTitle="$299 per night"
                            className="mb-4"
                        >
                            <p className="m-0">A luxurious experience with ocean views and exclusive amenities.</p>
                            <Rating value={5} readOnly stars={5} cancel={false} className="mt-3" />
                        </Card>
                    </div>
                    <div className="col-12 md:col-4">
                        <Card
                            title="Deluxe Room"
                            subTitle="$199 per night"
                            className="mb-4"
                        >
                            <p className="m-0">Modern comfort with city views and premium services.</p>
                            <Rating value={4} readOnly stars={5} cancel={false} className="mt-3" />
                        </Card>
                    </div>
                    <div className="col-12 md:col-4">
                        <Card
                            title="Standard Room"
                            subTitle="$99 per night"
                            className="mb-4"
                        >
                            <p className="m-0">A cozy and affordable room, perfect for short stays.</p>
                            <Rating value={3} readOnly stars={5} cancel={false} className="mt-3" />
                        </Card>
                    </div>
                </div>
            </div>

            <Divider />

            {/* User Reviews */}
            <div className="p-5">
                <h2 className="text-center text-4xl mb-5">What Our Guests Say</h2>
                <div className="grid grid-nogutter">
                    <div className="col-12 md:col-4">
                        <Card title="John Doe" subTitle="Stayed at Luxury Suite" className="mb-4">
                            <p>"Absolutely stunning views and top-notch service! Highly recommend this hotel."</p>
                            <Rating value={5} readOnly stars={5} cancel={false} />
                        </Card>
                    </div>
                    <div className="col-12 md:col-4">
                        <Card title="Jane Smith" subTitle="Stayed at Deluxe Room" className="mb-4">
                            <p>"Great location and comfortable room. I enjoyed my stay and will come back!"</p>
                            <Rating value={4} readOnly stars={5} cancel={false} />
                        </Card>
                    </div>
                    <div className="col-12 md:col-4">
                        <Card title="Michael Brown" subTitle="Stayed at Standard Room" className="mb-4">
                            <p>"Affordable and clean, but could use more amenities. Overall, a good value."</p>
                            <Rating value={3} readOnly stars={5} cancel={false} />
                        </Card>
                    </div>
                </div>
            </div>

            <Divider />

            {/* Promotions Section */}
            <div className="p-5 bg-light">
                <h2 className="text-center text-4xl mb-5">Exclusive Deals</h2>
                <div className="grid grid-nogutter">
                    <div className="col-12 md:col-6">
                        <Card
                            title="Stay 3 Nights, Get 1 Free"
                            subTitle="Available at select hotels"
                            className="mb-4"
                        >
                            <p>Enjoy a free night when you book a 3-night stay! Don't miss out on this limited-time offer.</p>
                        </Card>
                    </div>
                    <div className="col-12 md:col-6">
                        <Card
                            title="20% Off Winter Getaways"
                            subTitle="Book by December 31"
                            className="mb-4"
                        >
                            <p>Plan your winter escape with our 20% off deal. Perfect for snowy retreats and cozy stays.</p>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Footer Section */}
            <div className="p-4 text-center">
                <Divider />
                <p>© 2024 Hotel Booking App. All rights reserved.</p>
            </div>
        </div>
    );
};

export default MainPage;
