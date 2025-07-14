import type { Ride } from "typesModule";
import { icons } from "../constants";
import { formatDate, formatTime } from "../lib/utils";

export default function RideCard({
    ride: {
        destination_longitude,
        destination_latitude,
        origin_address,
        destination_address,
        created_at,
        ride_time,
        driver,
        payment_status,
    }, 
} : { ride: Ride} ) {
  
    return (
        <div className="flex flex-row items-center justify-center bg-white rounded-lg border-[3px] shadow-sm shadow-neutral-300 mb-3">
            <div className="flex flex-col w-full justify-center p-3">
                <div className="flex flex-row items-center justify-between mt-1">
                    <img src={`https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=400&center=lonlat:${destination_longitude},${destination_latitude}&zoom=14&apiKey=${import.meta.env.VITE_GEOAPIFY_API_KEY}`}
                    style={{ width: 90, height: 90 }}
                    className="rounded-lg"
                    />

                    <div className="flex flex-col mx-5 gap-y-5 flex-1">
                        <div className="flex flex-row items-center gap-x-2">
                            <img src={icons.to} style={{ width: 20, height: 20 }} />
                            <p className="text-md font-Medium">{origin_address}</p>
                        </div>
                        <div className="flex flex-row items-center gap-x-2">
                            <img src={icons.point} style={{ width: 20, height: 20 }} />
                            <p className="text-md font-Medium">{destination_address}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col w-full mt-5 bg-general-500 rounded-lg p-3 items-start justify-center">
                    <div className="flex flex-row items-center w-full justify-between mb-4">
                        <p className="text-md font-Medium text-gray-500">
                            Date & Time
                        </p>
                        <p className="text-md font-Medium text-gray-500">
                            {formatDate(created_at)}, {formatTime(ride_time)}
                        </p>
                    </div>

                    <div className="flex flex-row items-center w-full justify-between mb-4">
                        <p className="text-md font-Medium text-gray-500">
                            Driver
                        </p>
                        <p className="text-md font-Medium text-gray-500">
                            {driver.first_name} {driver.last_name}
                        </p>
                    </div>

                    <div className="flex flex-row items-center w-full justify-between mb-4">
                        <p className="text-md font-Medium text-gray-500">
                            Car Seats
                        </p>
                        <p className="text-md font-Medium text-gray-500">
                            {driver.car_seats}
                        </p>
                    </div>

                    <div className="flex flex-row items-center w-full justify-between mb-2">
                        <p className="text-md font-Medium text-gray-500">
                            Payment Status
                        </p>
                        <p className={`capitalize text-md font-Medium text-gray-500 ${payment_status === 'paid' ? 'text-green-500' : 'text-red-500'}`}>
                            {payment_status}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
};

