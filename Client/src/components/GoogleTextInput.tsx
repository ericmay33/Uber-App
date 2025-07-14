import React, { useEffect, useRef, useState } from 'react';
import type { GoogleInputProps } from 'typesModule';

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const GoogleTextInput = ({
    icon,
    initialLocation,
    containerStyle,
    textInputBackgroundColor,
    handlePress,
}: GoogleInputProps) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        const loadGoogleMapsScript = () => {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
            script.async = true;
            script.onload = () => {
                setIsLoaded(true);
            };
            script.onerror = () => {
                setLoadError(true);
            };
            document.head.appendChild(script);
        };

        loadGoogleMapsScript();
    }, []);

    useEffect(() => {
        if (isLoaded && inputRef.current) {
            const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);

            const handlePlaceChanged = () => {
                const place = autocomplete.getPlace();
                if (place.geometry) {
                    // Update inputValue with the selected place's formatted address
                    setInputValue(place.formatted_address || '');

                    handlePress({
                        latitude: place.geometry.location.lat(),
                        longitude: place.geometry.location.lng(),
                        address: place.formatted_address || '',
                    });
                }
            };

            autocomplete.addListener('place_changed', handlePlaceChanged);

            // Cleanup listener on component unmount
            return () => {
                window.google.maps.event.clearInstanceListeners(autocomplete);
            };
        }
    }, [isLoaded, handlePress]);

    if (loadError) {
        console.error('Error loading Google Maps');
        return <div>Error loading Google Maps</div>;
    }
    if (!isLoaded) return <div>Loading...</div>;

    return (
        <div className={`flex flex-row items-center justify-center relative z-50 rounded-xl ${containerStyle} mb-5`}>
            <img src={icon} className="w-8 h-8 ml-3 mr-1" alt="Search Icon" />
            <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                style={{
                    width: '100%',
                    backgroundColor: textInputBackgroundColor || 'white',
                    fontSize: 16,
                    fontWeight: "600",
                    marginTop: 5,
                    borderRadius: 20,
                    padding: 10,
                    border: "none",
                    outline: "none",
                    zIndex: 1000,
                }}
                placeholder={
                    initialLocation ? initialLocation : "Where do you want to go?"
                }
            />
        </div>
    );
};

export default GoogleTextInput;
