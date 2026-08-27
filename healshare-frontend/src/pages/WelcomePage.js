import React from "react";
import "./WelcomePage.css";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/background.jpg";

function WelcomePage() {
  const navigate = useNavigate();

  const handlePharmacistClick = () => {
    navigate("/pharmacist/login");
  };

  const handleCustomerClick = () => {
    navigate("/customer/login");
  };


  return (
    <div
      className="welcome-container"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >

      <div className="welcome-content">
        <h1 className="welcome-title">Welcome to Healshare</h1>
        <h2 className="welcome-subtitle">Medicine at your comfort</h2>
        <div className="button-group">
          <button className="role-button" onClick={handlePharmacistClick}>
            I am a Pharmacist
          </button>
          <button className="role-button" onClick={handleCustomerClick}>
            I am a Customer
          </button>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;