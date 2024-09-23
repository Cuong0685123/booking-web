"use client";

import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { useRouter } from 'next/navigation';
import { deleteHotel, getHotelById } from '@/booking/service/AddHotel'; // Import service functions

const DeleteHotel = () => {
    const [hotelId, setHotelId] = useState<string>(''); // State for hotel ID as string
    const [hotel, setHotel] = useState<any>(null); // State for fetched hotel details
    const [confirmDelete, setConfirmDelete] = useState(false); // State for confirmation
    const router = useRouter();

    const fetchHotel = async () => {
        if (hotelId) {
            try {
                const fetchedHotel = await getHotelById(Number(hotelId)); // Fetch hotel details
                setHotel(fetchedHotel);
            } catch (error) {
                console.error("Error fetching hotel", error);
                setHotel(null); // Reset hotel state on error
            }
        }
    };

    const handleDelete = async () => {
        try {
            await deleteHotel(Number(hotelId)); // Delete hotel
            router.push('/auth/mainpage'); // Redirect after deletion
        } catch (error) {
            console.error("Error deleting hotel", error);
        }
    };

    return (
        <div className="flex justify-content-center align-items-center min-h-screen">
            <div className="col-12 md:col-6">
                <Panel header="Delete Hotel" className="p-4">
                    <div className="field">
                        <label htmlFor="hotelId">Hotel ID:</label>
                        <InputText
                            id="hotelId"
                            value={hotelId} // Use hotelId as string
                            onChange={(e) => setHotelId(e.target.value)}
                            onBlur={fetchHotel} // Fetch hotel details on blur
                        />
                    </div>

                    {hotel && (
                        <div className="confirmation-message">
                            <p>Are you sure you want to delete the hotel: <strong>{hotel.name}</strong>?</p>
                            <div className="flex justify-content-between">
                                <Button label="Cancel" icon="pi pi-times" onClick={() => setConfirmDelete(false)} className="p-button-secondary" />
                                <Button label="Confirm" icon="pi pi-check" onClick={handleDelete} className="p-button-danger" />
                            </div>
                        </div>
                    )}
                </Panel>
            </div>
        </div>
    );
};

export default DeleteHotel;
