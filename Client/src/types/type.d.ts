declare module "typesModule" {
    export interface Driver {
        driver_id: number;
        first_name: string;
        last_name: string;
        profile_image_url: string;
        car_image_url: string;
        car_seats: number;
        rating: number;
    }

    export interface MarkerData {
        latitude: number;
        longitude: number;
        id: number;
        title: string;
        profileImageUrl: string;
        carImageUrl: string;
        carSeats: number;
        rating: number;
        firstName: string;
        lastName: string;
        time?: number;
        price?: string;
    }

    export interface MapProps {
        destinationLatitude?: number;
        destinationLongitude?: number;
        onDriverTimesCalculated?: (driversWithTimes: MarkerData[]) => void;
        selectedDriver?: number | null;
        onMapReady?: () => void;
    }

    export interface Ride {
        origin_address: string;
        destination_address: string;
        origin_latitude: number;
        origin_longitude: number;
        destination_latitude: number;
        destination_longitude: number;
        ride_time: number;
        fare_price: number;
        payment_status: string;
        driver_id: number;
        user_email: string;
        created_at: string;
        driver: {
            first_name: string;
            last_name: string;
            car_seats: number;
        };
    }

    export interface ButtonProps {
        onPress: () => void; // Changed from 'function' to '() => void' for clarity
        title: string;
        bgVariant?: "primary" | "secondary" | "danger" | "outline" | "success";
        textVariant?: "primary" | "default" | "secondary" | "danger" | "success";
        IconLeft?: React.ComponentType<any>;
        IconRight?: React.ComponentType<any>;
        className?: string;
    }

    export interface OnboardingSlideProps {
        item: {
            id: number;
            image: any;
            title: string;
            description: string;
        };
        isActive: boolean;
        index: number;
        activeIndex: number;
    }

    export interface GoogleInputProps {
        icon?: string;
        initialLocation?: string;
        containerStyle?: string;
        textInputBackgroundColor?: string;
        handlePress: ({
            latitude,
            longitude,
            address,
        }: {
            latitude: number;
            longitude: number;
            address: string;
        }) => void;
    }

    export interface InputFieldProps {
        label: string;
        icon?: string; // Change to string if you're passing icon URLs
        secureTextEntry?: boolean;
        labelStyle?: string;
        containerStyle?: string;
        inputStyle?: string;
        iconStyle?: string;
        className?: string;
        value: string; // Add value prop
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    }

    export interface PaymentProps {
        name: string;
        email: string;
        userId: number;
        amount: string;
        driverId: number;
        rideTime: number;
    }

    export interface LocationStore {
        userLatitude: number | null;
        userLongitude: number | null;
        userAddress: string | null;
        destinationLatitude: number | null;
        destinationLongitude: number | null;
        destinationAddress: string | null;
        setUserLocation: ({
            latitude,
            longitude,
            address,
        }: {
            latitude: number;
            longitude: number;
            address: string;
        }) => void;
        setDestinationLocation: ({
            latitude,
            longitude,
            address,
        }: {
            latitude: number;
            longitude: number;
            address: string;
        }) => void;
    }

    export interface DriverStore {
        drivers: MarkerData[];
        selectedDriver: number | null;
        setSelectedDriver: (driverId: number) => void;
        setDrivers: (drivers: MarkerData[]) => void;
        clearSelectedDriver: () => void;
    }

    export interface DriverCardProps {
        item: MarkerData;
        selected: number;
        setSelected: () => void;
    }
}
