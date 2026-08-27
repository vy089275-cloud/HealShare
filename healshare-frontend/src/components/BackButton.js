import React from "react";
import "./BackButton.css";
import { useNavigate } from "react-router-dom";

function BackButton() {
  const navigate = useNavigate();

  return (
    <button className="back-button" onClick={() => navigate("/")}>
      ← Back
    </button>
  );
}
export default BackButton;