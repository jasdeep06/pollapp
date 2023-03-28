import { useState } from "react";

export default useOtpValidation = (validateOtp) => {
    const [otp, setOtp] = useState("");
    const [otpResponse, setOtpResponse] = useState(null);
    const [isOtpValidating, setIsOtpValidating] = useState(false);

    const handleOtpChange = (value) => {
        setOtp(value);
        if (value.length === 4) {
            console.log(value)
        }
    }

    const handleOtpSubmit = async () => {
        setIsOtpValidating(true);
        try{
            const response = await validateOtp(otp);
            setOtpResponse(response);
            setIsOtpValidating(false);
        }catch (err){
            console.log(err);
        }
    }

    return { otp, otpResponse, handleOtpChange, handleOtpSubmit,isOtpValidating}

}