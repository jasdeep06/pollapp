import React,{useEffect, useState} from 'react';

export default useOtpResend = (resendOtp,maxTime) => {
    const [timeRem,setTimeRem] = useState(maxTime);
    const [resendResponse,setResendResponse] = useState(null);
    const [resendOngoing,setResendOngoing] = useState(false);
    const [resendError,setResendError] = useState(false);

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
            setResendError(false)
            setResendOngoing(true);
            const response = await resendOtp();
            console.log(response.data)
            if(response.data.status == 0){
                setResendResponse(response);
            }else{
                setResendError(true);
                setResendOngoing(false);
                console.log(response.data)
            }
        }catch (err){
            setResendError(true);
            setResendOngoing(false);
            console.log(err);
        }
    }

    useEffect(() => {
        if(resendResponse){
            setResendOngoing(false);
            setTimeRem(maxTime);
        }
    },[resendResponse])

    return { timeRem, resendResponse,resendError, handleResendOtp,resendOngoing}

}