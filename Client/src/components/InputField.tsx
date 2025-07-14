import type { InputFieldProps } from "typesModule";
import { useState } from "react";

export default function InputField({
    label, 
    labelStyle, 
    icon, 
    secureTextEntry = false,  
    containerStyle,
    inputStyle,
    iconStyle,
    value,
    onChange,
    ...props
}: InputFieldProps) {
        
    const [isFocused, setIsFocused] = useState(false);
    
    return (
        <div className="flex flex-col mb-4 w-full">
            <label className={`text-base font-SemiBold mb-3 ${labelStyle}`}>
                {label}
            </label>
            <div className={`flex flex-row justify-start items-center relative bg-neutral-100 rounded-full border ${isFocused ? 'border-primary-500' : 'border-neutral-100'} ${containerStyle}`}>
                {icon && (
                    <img src={icon} alt="" style={{ width: 30, height: 30 }} className={`ml-4 ${iconStyle}`} /> 
                )}
                <input 
                    type={secureTextEntry ? 'password' : 'text'} 
                    className={`rounded-full p-4 font-SemiBold text-gray-600 text-[14px] flex-1 ${inputStyle} text-left focus:border-none focus:outline-none bg-neutral-100`} 
                    value={value}
                    onChange={onChange}
                    onFocus={() => setIsFocused(true)} 
                    onBlur={() => setIsFocused(false)} 
                    {...props}
                />
            </div>
        </div>
    );
}
