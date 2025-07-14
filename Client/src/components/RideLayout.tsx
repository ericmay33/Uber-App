import { useNavigate } from "react-router-dom";
import { icons } from "../constants";
import Map from "./Map";
import React from "react";

export default function RideLayout({ title, children, sheetSize } : { title: string, children: React.ReactNode, sheetSize: number }) {
  const navigate = useNavigate();

  // Prevent body scrolling
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto'; // Reset on unmount
    };
  }, []);

  const mapSize = 100-sheetSize;

  return (
    <div className="flex-1 bg-white">  
      <div className="flex flex-col h-screen bg-blue-500">
        <div onClick={() => navigate(-1)} className="flex flex-row absolute z-10 ml-2 top-5 items-center justify-start p-2 bg-gray-400 rounded-full cursor-pointer">
          <div>
            <div className="flex w-8 h-8 bg-white rounded-full items-center justify-center">
              <img src={icons.backArrow} className="w-full h-full object-contain" />
            </div>
          </div>

          <p className="text-lg font-SemiBold ml-3">
            {title || 'Go Back'}
          </p>
        </div>

        <div style={{ height: `${mapSize}%` }}>
          <Map key={'ride'}/>
        </div>

        <div style={{ height: `${sheetSize}%`, padding: '1rem', overflowY: 'auto' }} className="bg-white">
          {children}
        </div>
      </div>
    </div>
  );
}
