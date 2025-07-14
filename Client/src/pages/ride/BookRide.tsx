import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RideLayout from '../../components/RideLayout';
import { useDriverStore, useLocationStore } from "../../store";
import { formatTime } from "../../lib/utils";
import { icons } from "../../constants";
import axios from "axios";
import Payment from "../../components/Payment";

interface User {
  userId: number,
  name: string;
  email: string;
}

export default function BookRide() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); 

  async function fetchUserData() {
    try {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        const response = await axios.get('http://localhost:3000/api/users/user', {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        });

        if (response.status === 200) {
          setUser(response.data);
        }
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      localStorage.removeItem('token');
      setUser(null);
      navigate('/signin');
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
    } else {
      fetchUserData();
    }
  }, [navigate]);

  const { userAddress, destinationAddress } = useLocationStore();
  const { drivers, selectedDriver } = useDriverStore();

  const driverDetails = drivers?.find(driver => +driver.id === selectedDriver);
  console.log('BOOK:', driverDetails?.price)

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <RideLayout title="Book Ride" sheetSize={55}>
      <>
        <p className="text-xl font-SemiBold mb-3">
          Ride Information
        </p>

        <div className="flex flex-row w-full items-center justify-left mt-5">
          <div className="w-24 mr-2">
            <img
              src={driverDetails?.profileImageUrl}
              alt="Driver Profile"
              className="h-full rounded-full"
            />
          </div>

          <div className="flex flex-row items-center justify-center space-x-2">
            <p className="text-lg font-SemiBold">
              {driverDetails?.firstName} {driverDetails?.lastName}
            </p>

            <div className="flex flex-row items-center space-x-0.5">
              <img
                src={icons.star}
                alt="Star Icon"
                className="w-5 h-5"
                style={{ objectFit: 'contain' }}
              />
              <p className="text-md font-Regular">
                {driverDetails?.rating}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full items-start justify-center py-2 px-5 rounded-3xl bg-general-600 mt-4">
          <div className="flex flex-row items-center justify-between w-full border-b border-white py-3">
            <p className="text-md font-Regular">Ride Price</p>
            <p className="text-md font-Regular text-[#0CC25F]">
              ${driverDetails?.price}
            </p>
          </div>

          <div className="flex flex-row items-center justify-between w-full border-b border-white py-3">
            <p className="text-md font-Regular">Pickup Time</p>
            <p className="text-md font-Regular">
              {formatTime(driverDetails?.time || 5!)}
            </p>
          </div>

          <div className="flex flex-row items-center justify-between w-full py-3">
            <p className="text-md font-Regular">Car Seats</p>
            <p className="text-md font-Regular">
              {driverDetails?.carSeats}
            </p>
          </div>
        </div>

        <div className="flex flex-col w-full items-start justify-center mt-4">
          <div className="flex flex-row items-center justify-start mt-3 border-t border-b border-general-700 w-full py-3">
            <img src={icons.to} alt="To Icon" className="w-5 h-5" />
            <p className="text-md font-Regular ml-2">
              {userAddress}
            </p>
          </div>

          <div className="flex flex-row items-center justify-start border-b border-general-700 w-full py-3">
            <img src={icons.point} alt="Point Icon" className="w-5 h-5" />
            <p className="text-md font-Regular ml-2">
              {destinationAddress}
            </p>
          </div>
        </div>

        <Payment 
          name={user?.name} 
          email={user?.email}
          userId={user?.userId}
          amount={driverDetails?.price}
          driverId={driverDetails?.id}
          rideTime={driverDetails?.time}
        />
      </>
    </RideLayout>
  );
}
