import { images, icons } from "../../constants";
import InputField from "../../components/inputField";
import { useEffect, useState } from "react";
import CustomButton from "../../components/CustomButton";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/home')
    }
  }, []);

  const onSignUpPress = async () => {
    try {
      const signUpResponse = await axios.post('http://localhost:3000/api/users/signup', {
        name: form.name,
        email: form.email,
        password: form.password
      });

      console.log("Sign Up Response:", signUpResponse);

      if (signUpResponse.status === 201) {
        const token = signUpResponse.data.token;
        await localStorage.setItem('token', token);
        setShowSuccessModal(true);
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "An error occurred");
      setErrorModalVisible(true);
      console.error(JSON.stringify(err, null, 2));
    }
  }

  return (
    <div className="flex-1 bg-white">
      <div className="relative w-full h-[225px]">
        <img src={images.signUpCar} alt="Sign Up Car" style={{ width: '100%', height: 225 }} className="z-0" />
        <div className="absolute bottom-0 left-0 right-0 h-[10%] bg-gradient-to-t from-white to-transparent" />
        <p className="text-2xl text-black font-SemiBold absolute bottom-5 left-4">
          Create Your Account
        </p>
      </div>

      <div className="p-5">
        <InputField 
          label="Name" 
          placeholder="Enter your name" 
          icon={icons.person} 
          value={form.name} 
          onChange={(value) => setForm({ ...form, name: value.target.value })}
        />
        <InputField 
          label="Email" 
          placeholder="Enter your email" 
          icon={icons.email} 
          value={form.email} 
          onChange={(value) => setForm({ ...form, email: value.target.value })}
        />
        <InputField 
          label="Password" 
          placeholder="Enter your password" 
          icon={icons.lock} 
          secureTextEntry={true}
          value={form.password} 
          onChange={(value) => setForm({ ...form, password: value.target.value })}
        />

        <CustomButton 
          title={"Sign Up"} 
          onPress={onSignUpPress}
          className="mt-8 p-3"
        />

        <Link to="/signin" className="flex justify-center text-lg text-center text-general-200 mt-5">
          <p>Already have an account? </p>
          <p className="text-primary-500 ml-2">Log In</p>
        </Link>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <img src={images.check} alt="Success" style={{ width: 110, height: 110 }} className="mx-auto my-5" />
            <p className="text-3xl font-Bold text-center">Success</p>
            <p className="text-base text-gray-600 font-Regular text-center mt-2">
              You have successfully signed up.
            </p>
            <CustomButton 
              title="Browse Home"
              onPress={() => {
                setShowSuccessModal(false);
                navigate("/home")
              }}
              className="mt-5 p-3"
            />
          </div>
        </div>
      )}

      {errorModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white px-7 py-9 rounded-2xl min-h-[200px]">
            <p className="text-2xl font-ExtraBold mb-2">Error</p>
            <p className="font-Regular mb-5">{errorMessage}</p>
            <CustomButton 
              title="Close"
              onPress={() => setErrorModalVisible(false)}
              className="mt-5 p-3 bg-danger-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}
