import { useState } from "react";

export default useOtpValidation = (validateOtp) => {
    const [otp, setOtp] = useState("");
    const [otpResponse, setOtpResponse] = useState(null);
    const [isOtpValidating, setIsOtpValidating] = useState(false);
    const [otpError, setOtpError] = useState(false);

    const handleOtpChange = (value) => {
        setOtp(value);
        if (value.length === 4) {
            console.log(value)
        }
    }

    const handleOtpSubmit = async () => {
        setOtpError(false);
        setIsOtpValidating(true);
        try{
            const response = await validateOtp(otp);
            setOtpResponse(response);
            setIsOtpValidating(false);
        }catch (err){
            setOtpError(true);
            setIsOtpValidating(false)
            console.log(err);
        }
    }

    return { otp, otpResponse,otpError, handleOtpChange, handleOtpSubmit,isOtpValidating}

}