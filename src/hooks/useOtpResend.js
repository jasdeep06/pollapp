import React,{useEffect, useState} from 'react';

export default useOtpResend = (resendOtp,maxTime) => {
    const [timeRem,setTimeRem] = useState(maxTime);
    const [resendResponse,setResendResponse] = useState(null);
    const [resendOngoing,setResendOngoing] = useState(false);

    useEffect(() => {
        if(timeRem > 0){
            const timer = setTimeout(() => {
                setTimeRem(timeRem - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    },[timeRem]);

    const handleResendOtp = async () => {
        try{
            setResendOngoing(true);
            const response = await resendOtp();
            console.log(response)
            setResendResponse(response);
        }catch (err){
            console.log(err);
        }
    }

    useEffect(() => {
        if(resendResponse){
            setResendOngoing(false);
            setTimeRem(maxTime);
        }
    },[resendResponse])

    return { timeRem, resendResponse, handleResendOtp,resendOngoing}

}