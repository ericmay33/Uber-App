import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { images } from "../../constants";

export default function Chat() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
    }
  }, []);

  return (
    <div className="flex-1 bg-white p-5">
      <div style={{ flexGrow: 1, overflowY: 'scroll' }}>
        <h1 className="text-2xl font-Bold">Chat</h1>
        <div className="flex-1 flex-col h-fit flex justify-center items-center">
          <img
            src={images.message}
            alt="message"
            className="w-full h-40 mb-12"
            style={{ objectFit: 'contain' }}
          />
          <h2 className="text-3xl font-Bold mt-3">
            No Messages Yet
          </h2>
        </div>
      </div>
    </div>
  );
}
