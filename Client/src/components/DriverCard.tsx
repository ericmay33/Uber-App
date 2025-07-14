import { icons } from "../constants";
import { formatTime } from "../lib/utils";
import type { DriverCardProps } from "typesModule";

export default function DriverCard({item, selected, setSelected}: DriverCardProps) {

    console.log(item.price, item.time)
    return (
        <div
            onClick={setSelected}
            className={`${
                selected === item.id ? "bg-general-600" : "bg-white"
            } flex flex-row items-center justify-between py-5 px-3 rounded-xl cursor-pointer`}
        >
            <div className="flex justify-center items-center w-20">
                <img
                src={item.profileImageUrl}
                alt={`${item.title}'s profile`}
                className="h-14 rounded-full"
            />
            </div>

            <div className="flex-1 flex flex-col items-start justify-center mx-3">
                <div className="flex flex-row items-center justify-start mb-1">
                    <p className="text-lg font-Regular">{item.firstName} {item.lastName}</p>

                    <div className="flex flex-row items-center space-x-1 ml-2">
                        <img src={icons.star} alt="star icon" className="w-3.5 h-3.5" />
                        <p className="text-sm font-Regular">4</p>
                    </div>
                </div>

                <div className="flex flex-row items-center justify-start">
                    <div className="flex flex-row items-center">
                        <img src={icons.dollar} alt="dollar icon" className="w-4 h-4" />
                        <p className="text-sm font-Regular ml-1">
                            ${item.price}
                        </p>
                    </div>

                    <p className="text-sm font-Regular text-general-800 mx-1">
                        |
                    </p>

                    <p className="text-sm font-Regular text-general-800">
                        {formatTime(item.time!)}
                    </p>

                    <p className="text-sm font-Regular text-general-800 mx-1">
                        |
                    </p>

                    <p className="text-sm font-Regular text-general-800">
                        {item.carSeats} seats
                    </p>
                </div>
            </div>

            <img
                src={item.carImageUrl}
                alt={`${item.title}'s car`}
                className="h-16 w-16"
                style={{ objectFit: 'contain' }}
            />
        </div>
    );
};