import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className="home">
      <header className="hero">
        <h1>Welcome to MyApp</h1>
        <p>SIT313 - Full-Stack Development: Secure Frontend Applications</p>

        {/* Only 'Get Started' will be displayed if the user lacks authentication. */}
        {!currentUser && (
          <Link to="/register" className="cta">
            Get Started
          </Link>
        )}

        {/* If the person has authenticated, display their username.
         */}
        {currentUser && (
          <h2 className="greeting">Hello, {currentUser.username}!</h2>
        )}
      </header>

      {/* Only display features to authenticated users.*/}
      {currentUser && (
        <section className="features">
          <div className="feature-card">
            <h2>Check Weather</h2>
            <p>Get real-time weather updates for your city.</p>
            <Link to="/weather" className="cta">
              Check Weather
            </Link>
          </div>

          <div className="feature-card">
            <h2>ChatGPT Integration</h2>
            <p>
              Need real-time assistance with coding or troubleshooting? Try our
              ChatGPT integration for instant help.
            </p>
            <Link to="/chatgpt" className="cta">
              Use ChatGPT
            </Link>
          </div>

          <div className="feature-card">
            <h2>Secure Messaging & Collaboration</h2>
            <p>
              Communicate securely with other developers and collaborate on
              projects.
            </p>
            <Link to="/secure-messaging" className="cta">
              Start Messaging
            </Link>
          </div>

          <div className="feature-card">
            <h2>Upload Video Tutorials</h2>
            <p>Upload and share video tutorials with the community.</p>
            <Link to="/upload-video" className="cta">
              Upload Video
            </Link>
          </div>

          <div className="feature-card">
            <h2>Tutorials</h2>
            <p>View uploaded tutorials and learn new skills.</p>
            <Link to="/tutorial" className="cta">
              View Tutorials
            </Link>
          </div>
        </section>
      )}

      {/*Only when the user has authenticated will the Logout button be displayed */}
      {currentUser && (
        <footer>
          <Link to="/logout" className="logout-button">
            Logout
          </Link>
        </footer>
      )}
    </div>
  );
};

export default Home;
