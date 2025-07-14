import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import RideCard from "../../components/RideCard";
import { images } from "../../constants";

interface User {
  userId: number;
  name: string;
  email: string;
}

interface RawRide {
  id: number;
  originAddress: string;
  destinationAddress: string;
  originLatitude: string;
  originLongitude: string;
  destinationLatitude: string;
  destinationLongitude: string;
  rideTime: number | string;
  farePrice: string;
  paymentStatus: string;
  driverId: number;
  userId: string;
  createdAt: string;
  Driver: {
    id: number;
    firstName: string;
    lastName: string;
    profileImageUrl: string;
    carImageUrl: string;
    carSeats: number;
    rating: string;
  };
}

interface Ride {
  destination_longitude: string;
  destination_latitude: string;
  origin_address: string;
  destination_address: string;
  created_at: string;
  ride_time: number | string;
  driver: {
    first_name: string;
    last_name: string;
    car_seats: number;
  };
  payment_status: string;
}

export default function Rides() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [recentRides, setRecentRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchUserDataAndRides() {
    try {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        navigate("/signin");
        return;
      }

      const userResponse = await axios.get("http://localhost:3000/api/users/user", {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      if (userResponse.status === 200) {
        setUser(userResponse.data);

        const ridesResponse = await axios.get(
          `http://localhost:3000/api/rides/${userResponse.data.userId}`,
          {
            headers: { Authorization: `Bearer ${storedToken}` },
          }
        );

        if (ridesResponse.status === 200) {
          const transformedRides: Ride[] = ridesResponse.data.data.map((ride: RawRide) => ({
            destination_longitude: ride.destinationLongitude,
            destination_latitude: ride.destinationLatitude,
            origin_address: ride.originAddress,
            destination_address: ride.destinationAddress,
            created_at: ride.createdAt,
            ride_time: ride.rideTime,
            driver: {
              first_name: ride.Driver.firstName,
              last_name: ride.Driver.lastName,
              car_seats: ride.Driver.carSeats,
            },
            payment_status: ride.paymentStatus,
          }));

          setRecentRides(transformedRides);
        }
      }
    } catch (error) {
      console.error("Error fetching user or rides:", error);
      localStorage.removeItem("token");
      setUser(null);
      navigate("/signin");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUserDataAndRides();
  }, []);

  return (
    <div className="bg-general-300 min-h-screen w-full p-6 flex flex-col items-center">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-ExtraBold mb-6 text-center text-gray-800">Your Rides</h1>

        {loading ? (
          <p className="text-center text-gray-600 text-lg">Loading...</p>
        ) : recentRides.length > 0 ? (
          <div className="space-y-4">
            {recentRides.map((ride, index) => (
              <RideCard key={index} ride={ride} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mt-20">
            <img
              src={images.noResult}
              alt="No rides found"
              className="w-32 h-32 mb-4"
            />
            <p className="text-gray-500 text-lg">No rides found</p>
          </div>
        )}
      </div>
    </div>
  );
}
