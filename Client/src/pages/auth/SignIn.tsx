import { images, icons } from "../../constants";
import InputField from "../../components/inputField";
import { useEffect, useState } from "react";
import CustomButton from "../../components/customButton";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import OAuth from "../../components/OAuth";

export default function SignIn() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/home')
    }
  }, []);

  const onSignInPress = async () => {
    try {
      const signInResponse = await axios.post('http://localhost:3000/api/users/signin', {
        email: form.email,
        password: form.password,
      });

      console.log("Sign In Response:", signInResponse);

      if (signInResponse.status === 201) {
        const token = signInResponse.data.token;
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
        <img src={images.signUpCar} alt="Sign In Car" style={{ width: '100%', height: 225 }} className="z-0" />
        <p className="text-2xl text-black font-SemiBold absolute bottom-5 left-4">
          Welcome! 👋
        </p>
      </div>

      <div className="p-5">
        <InputField 
          label="Email" 
          placeholder="Enter your email" 
          icon={icons.email} 
          value={form.email} 
          onChange={(value) => setForm({ email: value.target.value, password: form.password })}
        />
        <InputField 
          label="Password" 
          placeholder="Enter your password" 
          icon={icons.lock} 
          secureTextEntry={true}
          value={form.password} 
          onChange={(value) => setForm({ email: form.email, password: value.target.value })}
        />

        <CustomButton 
          title={"Log In"} 
          onPress={onSignInPress}
          className="mt-8 p-3"
        />

        <a href="/signup" className="flex justify-center text-lg text-center text-general-200 mt-5">
          <span>Don&apos;t have an account? </span>
          <span className="text-primary-500 ml-2">Sign Up</span>
        </a>

        {/*<OAuth />*/}
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <img src={images.check} alt="Success" style={{ width: 110, height: 110 }} className="mx-auto my-5" />
            <p className="text-3xl font-Bold text-center">Success</p>
            <p className="text-base text-gray-600 font-Regular text-center mt-2">
              You have successfully logged in.
            </p>
            <CustomButton 
              title="Continue"
              onPress={() => {
                setShowSuccessModal(false);
                navigate("/home");
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
