import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocationStore } from "../../store";
import RideLayout from '../../components/RideLayout';
import GoogleTextInput from "../../components/GoogleTextInput";
import { icons } from "../../constants";
import CustomButton from "../../components/CustomButton";

export default function FindRide() {
  const navigate = useNavigate();

  const {
    userAddress,
    destinationAddress,
    setDestinationLocation,
    setUserLocation,
  } = useLocationStore();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin')
    }
  }, []);

  return (
    <RideLayout title="Ride" sheetSize={40}>
      <div className="my-1">
        <p className="text-lg font-SemiBold mb-3">From</p>
        <GoogleTextInput 
          icon={icons.target} 
          initialLocation={userAddress!} 
          containerStyle="bg-neutral-100 w-11/12" 
          textInputBackgroundColor="#f5f5f5" 
        handlePress={(location) => setUserLocation(location)} />
      </div>

      <div className="my-1">
        <p className="text-lg font-SemiBold mb-3">To</p>
        <GoogleTextInput 
          icon={icons.map} 
          initialLocation={destinationAddress!} 
          containerStyle="bg-neutral-100 w-11/12" 
          textInputBackgroundColor="#f5f5f5" 
        handlePress={(location) => setDestinationLocation(location)} />
      </div>

      <div className="flex justify-center items-center">
        <CustomButton title="Find Now" onPress={() => navigate('/confirm-ride')} className="mt-5 p-2 w-3/4"/>
      </div>
    </RideLayout>
  );
}