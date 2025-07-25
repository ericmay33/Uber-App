import { onboarding } from "../../constants";
import CustomButton  from "../../components/CustomButton";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Welcome3() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/home')
    }
  }, []);

  return (
    <div className="flex flex-col h-screen items-center justify-between bg-white">
      <div 
        onClick={() => navigate("/signup")} 
        className="w-screen flex justify-end items-end p-5 cursor-pointer"
      >
        <p className="text-black text-md font-Bold">Skip</p>
      </div>

      <div className="flex flex-col items-center justify-center p-5">
        <img src={onboarding[2].image} style={{ height: 350, objectFit: "contain"  }}/>
        <div className="flex flex-row items-center justify-center w-full mt-10">
          <p className="text-black text-[26px] font-bold mx-10 text-center">{onboarding[2].title}</p>
        </div>
          <p className="text-base font-SemiBold text-center text-[#858585] mx-10 mt-3">{onboarding[2].description}</p>
      </div>

      <CustomButton 
        title={"Get Started"} 
        onPress={() => navigate("/signup")}
        className="w-10/12 mt-3 p-3 mb-6"
      />
    </div>
  );
}