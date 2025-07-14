import RideCard from '../../components/RideCard'
import { images, icons } from '../../constants'
import { useEffect, useState } from 'react'
import axios from 'axios'
import GoogleTextInput from '../../components/GoogleTextInput'
import Map from '../../components/Map'
import { useLocationStore } from '../../store'
import { useNavigate } from 'react-router-dom'

interface User {
  userId: number,
  name: string;
  email: string;
}

export default function Home() {
  const { userLatitude, userLongitude, userAddress, setUserLocation, setDestinationLocation } = useLocationStore();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentRides, setRecentRides] = useState<any[]>([]);
  const navigate = useNavigate();

  
  function getUserCoordinates(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            reject(error);
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
      }
    });
  }


  async function getAddressFromCoordinates(latitude: number, longitude: number): Promise<string> {
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      if (response.data.status === 'OK' && response.data.results.length > 0) {
        return response.data.results[0].formatted_address;
      } else {
        throw new Error('No address found for the coordinates');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      throw error;
    }
  }


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

        const ridesResponse = await axios.get(`http://localhost:3000/api/rides/${response.data.userId}`, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        });

        if (ridesResponse.status === 200) {
          const transformedRides = ridesResponse.data.data.map((ride: any) => ({
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
    }
  } catch (err) {
    console.error('Error fetching user data or rides:', err);
    localStorage.removeItem('token');
    setUser(null);
    navigate('/signin');
  } finally {
    setLoading(false);
  }
}


  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin')
    }
  }, []);

  useEffect(() => {
    if (userLatitude === null || userLongitude === null || userAddress === null) {
      const requestLocation = async () => {
        try {
          const { latitude, longitude } = await getUserCoordinates();
          const address = await getAddressFromCoordinates(latitude, longitude);

          setUserLocation({
            latitude,
            longitude,
            address,
          });
        } catch (error) {
          console.warn('Could not get user location, using default:', error);
          setUserLocation({
            latitude: 27.7172,
            longitude: 85.324,
            address: "Kathmandu, Nepal",
          });
        }
      };
      requestLocation();
    }
  }, [setUserLocation]);


  function handleSignOut() {
    localStorage.removeItem('token');
    navigate('/signin')
  }

  function handleDestinationPress(location: { latitude: number, longitude: number, address: string }) {
    setDestinationLocation(location);
    navigate('/find-ride');
  }

  return (
    <div className='bg-general-300 flex-1 w-full h-screen p-1'>
      <div className='px-5 pb-24'>
        <div className='flex flex-row items-center justify-between my-5'>
          <p className='text-xl capitalize font-ExtraBold'>
            Welcome, {user ? user.name : 'Guest'} 👋
          </p>

          <button 
            onClick={handleSignOut} 
            className='flex justify-center items-center w-10 h-10 rounded-full bg-white pr-1'
          >
            <img src={icons.out} style={{ width: 20, height: 20 }} alt="Sign Out" />
          </button>
        </div>

        <GoogleTextInput 
          icon={icons.search}
          containerStyle="bg-white shadow-md shadow-neutral-300"
          handlePress={handleDestinationPress}
        />

        <p className='text-xl font-Bold mt-3 mb-3'>
          Your Current Location
        </p>
        <div className='flex flex-row items-center h-[300px]'>
          <Map key={'load'} />
        </div>

        <p className='text-xl font-Bold mt-3 mb-3'>
          Recent Rides
        </p>

        {recentRides && recentRides.length > 0 ? (
          <div>
            {recentRides.slice(0, 5).map((ride, index) => {
              return <RideCard key={index} ride={ride} />;
            })}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center'>
            {!loading ? (
              <>
                <img 
                  src={images.noResult} 
                  style={{ width: 130, height: 130 }} 
                  alt="No recent rides found." 
                />
                <p className='text-sm'>No recent rides found</p>
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}