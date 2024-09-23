"use client";

import { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { useRouter } from 'next/navigation';
import { getHotelById, updateHotel } from '@/booking/service/AddHotel'; // Import service functions

type Room = {
    roomNumber: string;
    type: string;
    price: number;
    isAvailable: boolean;
};

type Hotel = {
    id: number;
    name: string;
    address: string;
    rating: string;
    image: string;
    rooms: Room[];
};

const UpdateHotel = () => {
    const [hotelId, setHotelId] = useState<string>(''); // State for hotel ID as a string
    const [hotel, setHotel] = useState<Hotel | null>(null);
    const router = useRouter();

    const fetchHotel = async () => {
        const parsedHotelId = parseInt(hotelId, 10); // Parse the hotel ID to a number
        if (!isNaN(parsedHotelId)) {
            try {
                const fetchedHotel = await getHotelById(parsedHotelId); // Use parsed ID
                setHotel(fetchedHotel);
            } catch (error) {
                console.error("Error fetching hotel", error);
            }
        }
    };

    const handleHotelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (hotel) {
            setHotel({ ...hotel, [e.target.name]: e.target.value });
        }
    };

    const handleRoomChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (hotel) {
            const { name, value } = e.target;
            const newRooms = [...hotel.rooms];

            if (name === 'price') {
                newRooms[index].price = parseFloat(value) || 0; // Ensure price is a number
            } else if (name === 'isAvailable') {
                newRooms[index].isAvailable = value === 'true'; // Convert to boolean
            } else {
                newRooms[index][name as keyof Omit<Room, 'price' | 'isAvailable'>] = value;
            }

            setHotel({ ...hotel, rooms: newRooms });
        }
    };

    const addRoom = () => {
        if (hotel) {
            setHotel({
                ...hotel,
                rooms: [...hotel.rooms, { roomNumber: '', type: '', price: 0, isAvailable: true }]
            });
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && hotel) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setHotel({ ...hotel, image: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (hotel) {
            try {
                await updateHotel(hotel.id, hotel); // Call the service function with hotel ID
                router.push('/auth/mainpage'); // Redirect after successful submission
            } catch (error) {
                console.error("Error updating hotel", error);
            }
        }
    };

    return (
        <div className="flex justify-content-center align-items-center min-h-screen">
            <div className="col-12 md:col-6">
                <Panel header="Update Hotel" className="p-4">
                    <form onSubmit={handleSubmit} className="p-fluid">
                        <div className="field">
                            <label htmlFor="hotelId">Hotel ID:</label>
                            <InputText
                                name="hotelId"
                                value={hotelId} // Always a string
                                onChange={(e) => setHotelId(e.target.value)} // Update state as string
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        fetchHotel(); // Fetch hotel on Enter key press
                                    }
                                }}
                            />
                            <Button
                                type="button"
                                label="Fetch Hotel"
                                onClick={fetchHotel}
                                className="mt-2"
                            />
                        </div>

                        {hotel && (
                            <>
                                <div className="field">
                                    <label htmlFor="name">Hotel Name:</label>
                                    <InputText name="name" value={hotel.name} onChange={handleHotelChange} />
                                </div>
                                <div className="field">
                                    <label htmlFor="address">Address:</label>
                                    <InputText name="address" value={hotel.address} onChange={handleHotelChange} />
                                </div>
                                <div className="field">
                                    <label htmlFor="rating">Rating:</label>
                                    <InputText name="rating" value={hotel.rating} onChange={handleHotelChange} />
                                </div>
                                <div className="field">
                                    <label htmlFor="image">Image URL:</label>
                                    <div className="flex align-items-center">
                                        <InputText name="image" value={hotel.image} onChange={handleHotelChange} />
                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="ml-2" />
                                    </div>
                                </div>

                                <h3>Rooms</h3>
                                {hotel.rooms.map((room, index) => (
                                    <div key={index} className="grid mb-3">
                                        <div className="col-12 md:col-3">
                                            <label htmlFor={`roomNumber-${index}`}>Room Number:</label>
                                            <InputText
                                                name="roomNumber"
                                                value={room.roomNumber}
                                                onChange={(e) => handleRoomChange(index, e)}
                                            />
                                        </div>
                                        <div className="col-12 md:col-3">
                                            <label htmlFor={`type-${index}`}>Room Type:</label>
                                            <InputText
                                                name="type"
                                                value={room.type}
                                                onChange={(e) => handleRoomChange(index, e)}
                                            />
                                        </div>
                                        <div className="col-12 md:col-3">
                                            <label htmlFor={`price-${index}`}>Price:</label>
                                            <InputText
                                                name="price"
                                                type="number"
                                                value={room.price.toString()} // Convert number to string
                                                onChange={(e) => handleRoomChange(index, e)}
                                            />
                                        </div>
                                        <div className="col-12 md:col-3">
                                            <label htmlFor={`isAvailable-${index}`}>Is Available:</label>
                                            <InputText
                                                name="isAvailable"
                                                value={room.isAvailable ? 'true' : 'false'}
                                                onChange={(e) => handleRoomChange(index, e)}
                                            />
                                        </div>
                                    </div>
                                ))}

                                <Button type="button" label="Add Another Room" icon="pi pi-plus" onClick={addRoom} className="mt-2 mb-4" />
                                <Button type="submit" label="Submit" icon="pi pi-check" />
                            </>
                        )}
                    </form>
                </Panel>
            </div>
        </div>
    );
};

export default UpdateHotel;
