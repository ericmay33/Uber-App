import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDriverStore } from "../../store";
import RideLayout from '../../components/RideLayout';
import DriverCard from "../../components/DriverCard";
import CustomButton from "../../components/CustomButton";

export default function ConfirmRide() {
    const navigate = useNavigate();
    const { drivers, selectedDriver, setSelectedDriver } = useDriverStore();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/signin');
        }
    }, [navigate]);

    console.log("Drivers in ConfirmRide:", drivers);

    if (!drivers) {
        return <div>Loading drivers...</div>; 
    }

    return (
        <RideLayout title="Choose A Driver" sheetSize={50}>
        {drivers.map((driver) => (
            <DriverCard 
                selected={selectedDriver!} 
                setSelected={() => setSelectedDriver(Number(driver.id)!)} 
                item={driver}
            />
        ))}
            <div className="flex justify-center items-center">
                <CustomButton title="Select Ride" className="p-3 w-2/3 mb-8 mt-5" onPress={() => navigate('/book-ride')}/>
            </div>
        </RideLayout>
    );
}
