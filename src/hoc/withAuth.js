import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import useAuth from AuthContext

const withAuth = (Component) => {
  return (props) => {
    //// Retrieve the active user from AuthContext
    const { currentUser } = useAuth();

    if (!currentUser) {
      // Send users to the login page if they haven't authenticated.
      return <Navigate to="/login" />;
    }

    // Render the successfully completed component if verified.
    return <Component {...props} />;
  };
};

export default withAuth;
