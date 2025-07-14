import axios from 'axios'; // Import Axios
import type { MarkerData } from "typesModule";
import type { Driver } from "typesModule";

const directionsAPI = import.meta.env.VITE_GOOGLE_API_KEY;

export const generateMarkersFromData = ({
    data,
    userLatitude,
    userLongitude,
}: {
    data: Driver[];
    userLatitude: number;
    userLongitude: number;
}): MarkerData[] => {
    return data.map((driver) => {
        const latOffset = (Math.random() - 0.5) * 0.02;
        const lngOffset = (Math.random() - 0.5) * 0.02;

        return {
            latitude: userLatitude + latOffset,
            longitude: userLongitude + lngOffset,
            id: driver.driver_id,
            title: `${driver.first_name} ${driver.last_name}`,
            ...driver,
        };
    });
};

export const calculateRegion = ({
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
}: {
    userLatitude: number | null;
    userLongitude: number | null;
    destinationLatitude?: number | null;
    destinationLongitude?: number | null;
}) => {
    if (!userLatitude || !userLongitude) {
        return {
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        };
    }

    if (!destinationLatitude || !destinationLongitude) {
        return {
            latitude: userLatitude,
            longitude: userLongitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        };
    }

    const minLat = Math.min(userLatitude, destinationLatitude);
    const maxLat = Math.max(userLatitude, destinationLatitude);
    const minLng = Math.min(userLongitude, destinationLongitude);
    const maxLng = Math.max(userLongitude, destinationLongitude);

    const latitudeDelta = (maxLat - minLat) * 1.3;
    const longitudeDelta = (maxLng - minLng) * 1.3;

    const latitude = (userLatitude + destinationLatitude) / 2;
    const longitude = (userLongitude + destinationLongitude) / 2;

    return {
        latitude,
        longitude,
        latitudeDelta,
        longitudeDelta,
    };
};

export const calculateDriverTimes = async ({
    markers,
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
}: {
    markers: MarkerData[];
    userLatitude: number | null;
    userLongitude: number | null;
    destinationLatitude: number | null;
    destinationLongitude: number | null;
}) => {
    if (
        !userLatitude ||
        !userLongitude ||
        !destinationLatitude ||
        !destinationLongitude
    ) {console.log('EXIT EARLY');return;}

    try {
        const timesPromises = markers.map(async (marker) => {

            const responseToUser = await axios.get(`http://localhost:3000/api/directions/`, {
                params: {
                    origin: `${marker.latitude},${marker.longitude}`,
                    destination: `${userLatitude},${userLongitude}`,
                },
            });
            const timeToUser = responseToUser.data.routes[0].legs[0].duration.value;

            const responseToDestination = await axios.get(`http://localhost:3000/api/directions/`, {
                params: {
                    origin: `${userLatitude},${userLongitude}`,
                    destination: `${destinationLatitude},${destinationLongitude}`,
                },
            });

            const timeToDestination = responseToDestination.data.routes[0].legs[0].duration.value;

            const totalTime = (timeToUser + timeToDestination) / 60;
            const price = (totalTime * 0.5).toFixed(2); 

            return { ...marker, time: totalTime, price };
        });

        return await Promise.all(timesPromises);
    } catch (error) {
        console.error("Error calculating driver times:", error);
        return "NONE";
    }
}