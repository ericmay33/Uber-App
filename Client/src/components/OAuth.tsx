import CustomButton from "./CustomButton";
import { icons } from "../constants";


export default function OAuth() {

    async function handleGoogleSignIn() {
        console.log('google log in')
    };

    return (
        <div>
            <div className="flex flex-row justify-center items-center mt-5 mb-1 gap-x-3">
                <div className="flex-1 h-[1px] bg-general-100"/>
                <p className="text-base font-SemiBold">Or</p>
                <div className="flex-1 h-[1px] bg-general-100"/>
            </div>

            <CustomButton 
                title="Log In With Google"
                className="mt-5 w-full shadow-none p-3 mt-1 mb-5 w-11/12"
                IconLeft={() => (
                    <img src={icons.google} style={{ width: 30, height: 28 }} className="mx-3"/>
                )}
                bgVariant="outline"
                textVariant="primary"
                onPress={handleGoogleSignIn}
            />
        </div>
    );
};

