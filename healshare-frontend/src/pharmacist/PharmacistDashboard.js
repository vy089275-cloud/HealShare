import React, { useState } from "react";
import "./PharmacistDashboard.css";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import ProfileModal from "./ProfileModal";
import backgroundImg from "../assets/pharmacistBackground.jpg";

export default function PharmacistDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="ph-dashboard-root">
      {/* Top bar with logo (left) and profile icon (right) */}
      <Topbar onProfileToggle={() => setProfileOpen((v) => !v)} />

      {/* Hamburger icon below logo */}
      {!sidebarOpen && (
        <div className="ph-left-wrapper">
          <button
            className="ph-hamburger"
            onClick={() => setSidebarOpen(true)}
            aria-label="Toggle sidebar"
          >
            &#9776;
          </button>
        </div>
      )}

      {/* Sidebar with close button inside */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Profile modal opens on right */}
      {profileOpen && <ProfileModal onClose={() => setProfileOpen(false)} />}

      {/* Main content area */}
      <main className="ph-main">
        <div className="ph-bg-wrap">
          <img src={backgroundImg} alt="background" className="ph-background" />
        </div>
      </main>
    </div>
  );
}  