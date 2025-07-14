import { GoogleMap, Marker, Polyline } from "@react-google-maps/api"; // Import Polyline
import { useDriverStore, useLocationStore } from "../store";
import { calculateRegion, generateMarkersFromData } from "../lib/map";
import { calculateDriverTimes } from "../lib/map";
import { useEffect, useState } from 'react';
import type { MarkerData } from "typesModule";
import { icons } from "../constants";
import axios from "axios";

const containerStyle = {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
};

export default function Map() {
    const {
        userLongitude,
        userLatitude,
        destinationLatitude,
        destinationLongitude,
    } = useLocationStore();

    const { selectedDriver, setDrivers, drivers } = useDriverStore();
    const [markers, setMarkers] = useState<MarkerData[]>([]);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [loading, setLoading] = useState(true);
    const [directions, setDirections] = useState<string>('');

    const region = calculateRegion({
        userLongitude,
        userLatitude,
        destinationLatitude,
        destinationLongitude,
    });

    const center = {
        lat: region.latitude,
        lng: region.longitude,
    };

    const zoom = Math.round(Math.log2(360 / Math.max(region.latitudeDelta, region.longitudeDelta)));

    const fetchDrivers = async () => {
        console.log('Fetching drivers...');
        try {
            const response = await axios.get('http://localhost:3000/api/drivers/');
            setDrivers(response.data.data);
            console.log("Full response:", response);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching drivers:", err);
            setLoading(false);
        }
    };

    const fetchDirections = async () => {
    if (userLatitude && userLongitude && destinationLatitude && destinationLongitude) {
        const directionsService = new window.google.maps.DirectionsService();
        const request = {
            origin: new window.google.maps.LatLng(userLatitude, userLongitude),
            destination: new window.google.maps.LatLng(destinationLatitude, destinationLongitude),
            travelMode: window.google.maps.TravelMode.DRIVING,
        };

        console.log("Requesting directions:", request); 

        directionsService.route(request, (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
                console.log("Directions result:", result);

                if (result.routes.length > 0) {
                    const polylineString = result.routes[0].overview_polyline;
                    console.log("Encoded polyline string:", polylineString);
                    setDirections(polylineString);
                } else {
                    console.error("No routes found in the directions result.");
                }
            } else {
                console.error("Error fetching directions:", status);
            }
        });
    } else {
        console.warn("User or destination coordinates are missing.");
    }
};


    useEffect(() => {
        const loadGoogleMapsApi = () => {
            if (window.google && window.google.maps) {
                setMapLoaded(true);
            } else {
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_API_KEY}`;
                script.async = true;
                script.onload = () => setMapLoaded(true);
                document.body.appendChild(script);
            }
        };

        loadGoogleMapsApi();
    }, []);

    useEffect(() => {
        if (userLatitude && userLongitude) {
            setLoading(true);
            fetchDrivers();
            fetchDirections();
        }
    }, [userLatitude, userLongitude]);

    useEffect(() => {
        if (!loading && Array.isArray(drivers) && userLatitude && userLongitude) {
            const newMarkers = generateMarkersFromData({
                data: drivers,
                userLatitude,
                userLongitude
            }).filter(marker => marker.latitude && marker.longitude);

            setMarkers(newMarkers);
        }
    }, [drivers, userLatitude, userLongitude, loading]);

    useEffect(() => {
        if (markers.length > 0 && destinationLatitude && destinationLongitude) {
            calculateDriverTimes({
                markers,
                userLongitude,
                userLatitude,
                destinationLatitude,
                destinationLongitude
            }).then((updatedDrivers) => {
                if (JSON.stringify(updatedDrivers) !== JSON.stringify(drivers)) {
                    console.log('UPDATED', updatedDrivers);
                    setDrivers(updatedDrivers as MarkerData[]);
                }
            });
        }
    }, [markers, destinationLatitude, destinationLongitude, userLatitude, userLongitude]);

    if (!mapLoaded || loading || (!userLatitude || !userLongitude)) {
        return <div>Loading...</div>;
    }

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={zoom}
            options={{
                disableDefaultUI: true,
            }}
        >
            {markers.map((marker) => (
                <Marker 
                    key={marker.id}
                    position={{
                        lat: marker.latitude,
                        lng: marker.longitude
                    }}
                    title={marker.title}
                    icon={
                        selectedDriver === marker.id ? icons.selectedMarker : icons.marker
                    }
                />
            ))}

            {userLatitude && userLongitude && (
                <Marker 
                    key="location"
                    position={{
                        lat: userLatitude,
                        lng: userLongitude,
                    }}
                    title="Current Location"
                    icon={icons.point}
                />
            )}

            {destinationLatitude && destinationLongitude && (
                <>
                    <Marker 
                        key="destination"
                        position={{
                            lat: destinationLatitude,
                            lng: destinationLongitude,
                        }}
                        title="Destination"
                        icon={icons.pin}
                    />

                    {directions && (
                        <Polyline
                            path={window.google.maps.geometry.encoding.decodePath(directions)}
                            options={{
                                strokeColor: '#0286ff',
                                strokeOpacity: 0.8,
                                strokeWeight: 5,
                            }}
                        />
                    )}
                </>
            )}
        </GoogleMap>
    );
}
