import React, { useState } from "react";
import "./CustomerDashboard.css";
import CustomerTopbar from "./CustomerTopbar";
import CustomerSidebar from "./CustomerSidebar";
import CustomerProfileModal from "./CustomerProfileModal";
import backgroundImg from "../assets/customerBackground.jpg";

export default function CustomerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="ph-dashboard-root">
      {/* Top bar with logo (left) and profile icon (right) */}
      <CustomerTopbar onProfileToggle={() => setProfileOpen((v) => !v)} />

      {/* Hamburger icon below logo */}
      {!sidebarOpen && (
        <div className="ph-left-wrapper">
          <button
            className="ph-hamburger"
            onClick={() => setSidebarOpen(true)}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
        </div>
      )}

      {/* Sidebar with close button inside */}
      <CustomerSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Profile modal opens on right */}
      {profileOpen && <CustomerProfileModal onClose={() => setProfileOpen(false)} />}

      {/* Main content area */}
      <main className="ph-main">
        <div className="ph-bg-wrap">
          <img src={backgroundImg} alt="background" className="ph-background" />
        </div>
      </main>
    </div>
  );
}