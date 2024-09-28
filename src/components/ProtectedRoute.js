import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  //Take the user to the login page if they aren't already logged in.

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  //Make the child components visible if the user is logged in.

  return children;
};

export default ProtectedRoute;
