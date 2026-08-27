// src/pharmacist/Topbar.js
import React from "react";
import "./Topbar.css";
import logoImg from "../assets/logo.png";
import profileIcon from "../assets/profile-icon.png";

export default function Topbar({ onProfileToggle }) {

  return (
    <header className="ph-topbar">
      <div className="ph-topbar-left">
        <img src={logoImg} alt="HealShare" className="ph-logo" />
        <span className="ph-title">HealShare</span>
      </div>

      <div className="ph-topbar-right">
        <img
          src={profileIcon}
          alt="Profile"
          className="ph-profile-icon"
          onClick={onProfileToggle}
          title="Profile"
        />
      </div>
    </header>
  );
}