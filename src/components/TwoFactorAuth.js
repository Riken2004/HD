import React, { useState } from "react";
import axios from "axios";
import "./Register.css";

const TwoFactorAuth = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");

  const sendOTP = async () => {
    try {
      const res = await axios.post("http://localhost:5000/send-otp", {
        phoneNumber,
      });
      setOtpSent(true);
      setMessage(res.data.message);
    } catch (error) {
      setMessage("Failed to send OTP");
    }
  };

  const verifyOTP = async () => {
    try {
      const res = await axios.post("http://localhost:5000/verify-otp", {
        phoneNumber,
        otp,
      });
      setMessage(res.data.message);
    } catch (error) {
      setMessage("Failed to verify OTP");
    }
  };

  return (
    <div>
      <h2>Two-Factor Authentication (SMS)</h2>
      {!otpSent ? (
        <>
          <input
            type="text"
            placeholder="Phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <button onClick={sendOTP}>Send OTP</button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOTP}>Verify OTP</button>
        </>
      )}
      <p>{message}</p>
    </div>
  );
};

export default TwoFactorAuth;
