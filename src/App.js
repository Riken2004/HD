import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//Importing all the components
import Register from "./components/Register";
import Login from "./components/Login";
import TwoFactorAuth from "./components/TwoFactorAuth";
import ForgotPassword from "./components/ForgotPassword";
import { AuthProvider } from "./context/AuthContext";

const Home = React.lazy(() => import("./components/Home"));
const ChatGpt = React.lazy(() => import("./components/ChatGpt"));
const Weather = React.lazy(() => import("./components/Weather"));
const SecureMessaging = React.lazy(() =>
  import("./components/SecureMessaging")
);
const Tutorial = React.lazy(() => import("./components/Tutorial"));
const UploadVideo = React.lazy(() => import("./components/UploadVideo"));
const Logout = React.lazy(() => import("./components/Logout"));

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/2fa" element={<TwoFactorAuth />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />{" "}
            <Route path="/chatgpt" element={<ChatGpt />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/secure-messaging" element={<SecureMessaging />} />
            <Route path="/tutorial" element={<Tutorial />} />
            <Route path="/upload-video" element={<UploadVideo />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
};

export default App;
