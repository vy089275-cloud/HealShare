import React from "react";
import "./BackButton.css";
import { useNavigate } from "react-router-dom";

function CustDashboardBackButton() {
  const navigate = useNavigate();

  return (
    <button className="back-button" onClick={() => navigate("/customer/dashboard")}>
      ← Back
    </button>
  );
}

export default CustDashboardBackButton;