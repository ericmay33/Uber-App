import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { icons } from "../../constants";

interface User {
  userId: number,
  name: string;
  email: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
    }
  }, []);

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
        }
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      localStorage.removeItem('token');
      console.log('expired');
      setUser(null); 
      navigate('/signin');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="flex-1">
      <div className="px-5" style={{ paddingBottom: '120px', overflowY: 'scroll' }}>
        <h1 className="text-2xl font-JakartaBold my-5">My Profile</h1>

        <div className="flex items-center justify-center my-5">
          <img
            src={icons.person}
            alt="User Profile"
            style={{ width: '130px', height: '130px', borderRadius: '50%' }}
            className="rounded-full border-[1px] border-grey shadow-sm shadow-neutral-300 p-4"
          />
        </div>

        <div className="flex flex-col items-start justify-center bg-white rounded-lg shadow-sm shadow-neutral-300 px-5 py-3">
          <div className="flex flex-col items-start justify-start w-full">
            <div className="w-full">
              <label className="font-Bold">Name</label>
              <p className="p-3.5">{user?.name || "Not Found"}</p>
            </div>

            <div className="w-full">
              <label className="font-Bold">Email</label>
              <p className="p-3.5">{user?.email || "Not Found"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
