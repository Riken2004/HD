import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import axios from "axios";
import emailjs from "emailjs-com";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [qrCode, setQrCode] = useState(null);
  const [secret, setSecret] = useState("");
  const [otp, setOtp] = useState("");
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Make a new Firebase Authentication user.

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Keep user data safe in Firestore.(save)
      await setDoc(doc(db, "users", user.uid), {
        username: username,
        email: user.email,
        uid: user.uid,
        createdAt: new Date(),
        is2FAEnabled: is2FAEnabled,
      });

      // Send a registration notification email using EmailJS
      const templateParams = { email: email };

      emailjs
        .send(
          "service_cm1rzvz", // Service ID from my EmailJS
          "template_hm1mgck", // Template ID from my EmailJS
          templateParams,
          "n0mYD5Wn0P-OhOUEJ" // User ID from my EmailJS
        )
        .then(
          (response) => {
            console.log(
              "Email sent successfully!",
              response.status,
              response.text
            );
          },
          (error) => {
            //Record email send error

            console.error("Failed to send email. Error: ", error);
          }
        );

      if (is2FAEnabled) {
        generate2FA(user.uid); //Create 2FA if it is enabled.
      } else {
        navigate("/home"); // Redirect to home if 2FA is not enabled
      }
    } catch (error) {
      // Log to the terminal and set an error message.
      setError(error.message);
      console.error("Registration error: ", error);
    }
  };

  // feature that produces 2FA for the user
  const generate2FA = async (userId) => {
    try {
      const response = await axios.post("http://localhost:5000/generate-2fa", {
        userId,
      });
      //Show the QR code.
      setQrCode(response.data.qrCode);
      //save secret for otp
      setSecret(response.data.secret);
    } catch (error) {
      setError("Error generating 2FA");
      console.error("2FA error: ", error);
    }
  };

  // Function for verifying the otp
  const verify2FA = async () => {
    try {
      await axios.post("http://localhost:5000/verify-2fa", {
        userId: auth.currentUser.uid,
        token: otp,
      });
      navigate("/home"); // Upon successful OTP verification, redirect
    } catch (error) {
      setError("Invalid OTP");
      console.error("OTP verification error: ", error);
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      {/* Display error message */}
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label>
          <input
            type="checkbox"
            checked={is2FAEnabled}
            onChange={(e) => setIs2FAEnabled(e.target.checked)}
          />
          Enable Two-Factor Authentication
        </label>
        <button type="submit">Register</button>
      </form>
      {qrCode && (
        <div>
          <h3>Scan this QR Code</h3>
          <img src={qrCode} alt="2FA QR Code" />
        </div>
      )}
      {qrCode && (
        <div>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verify2FA}>Verify OTP</button>
        </div>
      )}
    </div>
  );
};

export default Register;
