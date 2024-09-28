import React, { useState, useEffect } from "react";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import emailjs from "emailjs-com";
import "./Login.css";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setCurrentUser, currentUser } = useAuth(); //Use the context-based setCurrentUser and currentUser methods.

  useEffect(() => {
    // Check if user is already authenticated or not
    if (currentUser) {
      navigate("/home");
    }
  }, [currentUser, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Utilise Firebase Authentication to log the user in.

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Get user information from Firestore.

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          username: userDoc.data().username,
        });

        // Once the user has been successfully set up, navigate to the homepage.
        navigate("/home");
      }

      // Use EmailJS to send a login notification email.
      const templateParams = { email: email };

      emailjs
        .send(
          "service_cm1rzvz", // Service ID from my EmailJS
          "template_eqdvf8u", // Template ID from my EmailJS
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
            console.error("Failed to send email. Error: ", error);
          }
        );
    } catch (error) {
      // Set the error message for the user
      setError("Error logging in: " + error.message);
      console.error("Login error: ", error);
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      {/* Display error message */}
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
      <p style={{ marginTop: "20px" }}>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
      <p style={{ marginTop: "20px" }}>
        Forgot your password? <Link to="/forgot-password">Reset here</Link>
      </p>
    </div>
  );
};

export default Login;
