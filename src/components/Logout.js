// src/components/Logout.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";

const Logout = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Sign out the user
        await signOut(auth);
        // Clear the user from context
        setCurrentUser(null);
        // Redirecting user to login page
        navigate("/login");
      } catch (error) {
        console.error("Error signing out: ", error);
      }
    };

    handleLogout();
  }, [navigate, setCurrentUser]);

  return (
    <div>
      <h2>Logging you out...</h2>
    </div>
  );
};

export default Logout;
