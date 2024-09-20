"use client";

import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { useRouter } from 'next/navigation';
import { addHotel } from '@/booking/service/addHotel'; // Import the service

type Room = {
    roomNumber: string;
    type: string;
    price: number;
    isAvailable: boolean;
};

type Hotel = {
    name: string;
    address: string;
    rating: string;
    image: string;
    rooms: Room[];
};

const AddHotelForm = () => {
    const [hotel, setHotel] = useState<Hotel>({
        name: '',
        address: '',
        rating: '',
        image: '',
        rooms: [{ roomNumber: '', type: '', price: 0, isAvailable: true }]
    });
    const router = useRouter();

    const handleHotelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHotel({ ...hotel, [e.target.name]: e.target.value });
    };

    const handleRoomChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newRooms = [...hotel.rooms];

        // Use type guards to set values correctly based on the field name
        if (name === 'price') {
            newRooms[index].price = parseFloat(value) || 0; // Ensure price is a number
        } else if (name === 'isAvailable') {
            newRooms[index].isAvailable = value === 'true'; // Convert to boolean
        } else {
            newRooms[index][name as keyof Omit<Room, 'price' | 'isAvailable'>] = value;
        }

        setHotel({ ...hotel, rooms: newRooms });
    };

    const addRoom = () => {
        setHotel({
            ...hotel,
            rooms: [...hotel.rooms, { roomNumber: '', type: '', price: 0, isAvailable: true }]
        });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setHotel({ ...hotel, image: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await addHotel(hotel); // Call the service function here
            router.push('/admin'); // Redirect after successful submission
        } catch (error) {
            console.error("Error adding hotel", error);
        }
    };

    return (
        <div className="flex justify-content-center align-items-center min-h-screen">
            <div className="col-12 md:col-6">
                <Panel header="Add Hotel" className="p-4">
                    <form onSubmit={handleSubmit} className="p-fluid">
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
                            <div key={index} className="grid">
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

                        <Button label="Add Another Room" icon="pi pi-plus" onClick={addRoom} className="mt-2 mb-4" />
                        <Button type="submit" label="Submit" icon="pi pi-check" />
                    </form>
                </Panel>
            </div>
        </div>
    );
};

export default AddHotelForm;
