'use client';

import { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Calendar as PRCalendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Rating } from 'primereact/rating';
import { Divider } from 'primereact/divider';
import { Dialog } from 'primereact/dialog';
import { useRouter } from 'next/navigation';
import { getAllHotels, getRoomsByHotelId } from '@/booking/service/AddHotel';

const MainPage = () => {
    const [dates, setDates] = useState<(Date | null)[] | null>(null);
    const [guests, setGuests] = useState<number>(1);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [hotels, setHotels] = useState<any[]>([]);
    const [selectedHotelRooms, setSelectedHotelRooms] = useState<any[]>([]);
    const [isDialogVisible, setIsDialogVisible] = useState<boolean>(false);
    const [selectedHotelName, setSelectedHotelName] = useState<string>('');
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');

        if (token) {
            setIsLoggedIn(true);
            if (username === 'admin') {
                setIsAdmin(true);
            }
        }

        const fetchHotels = async () => {
            try {
                const data = await getAllHotels();
                console.log('Fetched hotels:', data);

                const hotelList = Array.isArray(data) ? data : data.hotels || [];
                console.log('Hotel List:', hotelList);
                setHotels(hotelList);
            } catch (error) {
                console.error('Failed to fetch hotels:', error);
            }
        };

        fetchHotels();
    }, []);

    const handleDateChange = (event: any) => {
        setDates(event.value);
    };

    const handleGuestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const guestCount = +e.target.value;
        setGuests(guestCount > 0 ? guestCount : 1);
    };

    const handleSearch = () => {
        console.log('Searching for rooms: Dates:', dates, 'Guests:', guests);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setIsLoggedIn(false);
        router.push('/auth/login');
    };

    const navigateToLogin = () => {
        router.push('/auth/login');
    };

    const navigateToRegister = () => {
        router.push('/auth/register');
    };

    const handleAddRoom = () => {
        router.push('/auth/addhotel');
    };

    const handleEditRoom = () => {
        router.push('/auth/updatehotel');
    };

    const handleDeleteRoom = () => {
        router.push('/auth/deletehotel');
    };

    const handleViewRooms = async (hotelId: number, hotelName: string) => {
        try {
            const rooms = await getRoomsByHotelId(hotelId);
            const roomList = Array.isArray(rooms) ? rooms : rooms.data || [];
            console.log('Fetched rooms:', roomList);
            setSelectedHotelRooms(roomList);
            setSelectedHotelName(hotelName);
            setIsDialogVisible(true);
        } catch (error) {
            console.error('Failed to fetch rooms:', error);
        }
    };

    const handleBooking = (roomId: number) => {
        // Navigate to the booking page with the roomId as a query parameter
        router.push(`/auth/bookingpage?roomId=${roomId}`);
    };

    return (
        <div>
            <div className="p-3 shadow-2 flex justify-content-end align-items-center bg-gray-900">
                {isLoggedIn ? (
                    <>
                        <Button label="Logout" className="p-button-text text-white mr-2" onClick={handleLogout} />
                        {isAdmin && (
                            <div className="flex gap-2">
                                <Button label="Add Room" icon="pi pi-plus" className="p-button-success" onClick={handleAddRoom} />
                                <Button label="Edit Room" icon="pi pi-pencil" className="p-button-warning" onClick={handleEditRoom} />
                                <Button label="Delete Room" icon="pi pi-trash" className="p-button-danger" onClick={handleDeleteRoom} />
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <Button label="Login" className="p-button-text text-white mr-2" onClick={navigateToLogin} />
                        <Button label="Sign Up" className="p-button-outlined p-button-light" onClick={navigateToRegister} />
                    </>
                )}
            </div>

            <div className="p-5 text-center" style={{
                backgroundImage: 'url(/hero-banner.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: 'white',
            }}>
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

            <div className="p-5">
                <h2 className="text-center text-4xl mb-5">Featured Hotels</h2>
                <div className="grid grid-nogutter">
                    {hotels.length > 0 ? (
                        hotels.map((hotel) => (
                            <div key={hotel.id} className="col-12 md:col-4">
                                <Card title={hotel.name} subTitle={`${hotel.rating} stars`} className="mb-4">
                                    <p>{hotel.address}</p>
                                    <p>{hotel.image ? <img src={hotel.image} alt={hotel.name} style={{ maxWidth: '100%' }} /> : 'No Image Available'}</p>
                                    <Rating value={Math.round(hotel.rating)} readOnly stars={5} cancel={false} />
                                    <Button label="View Rooms" icon="pi pi-eye" className="p-button-outlined" onClick={() => handleViewRooms(hotel.id, hotel.name)} />
                                </Card>
                            </div>
                        ))
                    ) : (
                        <p>No hotels available.</p>
                    )}
                </div>
            </div>

            <Divider />

            <Dialog
                visible={isDialogVisible}
                style={{ width: '50vw' }}
                header={`Rooms in ${selectedHotelName}`}
                modal
                onHide={() => setIsDialogVisible(false)}
            >
                {selectedHotelRooms.length > 0 ? (
                    <ul>
                        {selectedHotelRooms.map(room => (
                            <li key={room.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
                                <div>
                                    <h4>{room.roomNumber}</h4>
                                    <p>Type: {room.type}</p>
                                    <p>Price: ${room.price.toFixed(2)}</p>
                                </div>
                                <Button
                                    label="Booking"
                                    icon="pi pi-calendar-plus"
                                    className="p-button-info"
                                    onClick={() => handleBooking(room.id)} // Redirect to booking page
                                />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No rooms available.</p>
                )}
            </Dialog>
        </div>
    );
};

export default MainPage;
