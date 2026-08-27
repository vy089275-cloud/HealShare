import React from "react";
import "./BackButton.css";
import { useNavigate } from "react-router-dom";

function PharDashboardBackButton() {
  const navigate = useNavigate();

  return (
    <button className="back-button" onClick={() => navigate("/pharmacist/dashboard")}>
      ← Back
    </button>
  );
}

export default PharDashboardBackButton;