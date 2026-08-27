import React from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "./Sidebar.css";

export default function Sidebar({ open, setOpen, notificationCount = 0 }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // clear auth tokens if you have, then navigate to login
    navigate("/");
  };

  return (
    <aside className={`ph-sidebar ${open ? "open" : ""}`} aria-hidden={!open}>
      {open && (
        <button
          className="ph-sidebar-close"
          onClick={() => setOpen(false)}
          aria-label="Close sidebar"
        >
          ✕
        </button>
      )}

      <nav className="ph-side-nav" aria-label="Pharmacist navigation">
        <ul>
          <li
            className="ph-side-item"
            onClick={() => {
              navigate("/pharmacist/medicines");
              setOpen(false);
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && (navigate("/pharmacist/medicines"), setOpen(false))}
          >
            Medicines
          </li>

          <li
            className="ph-side-item"
            onClick={() => {
              navigate("/pharmacist/reservations");
              setOpen(false);
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && (navigate("/pharmacist/reservations"), setOpen(false))}
          >
            Reservations
          </li>

          <li
            className="ph-side-item"
            onClick={() => {
              navigate("/pharmacist/notifications");
              setOpen(false);
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && (navigate("/pharmacist/notifications"), setOpen(false))}
          >
            Notifications
            {notificationCount > 0 && (
              <span className="ph-badge" aria-label={`${notificationCount} unread notifications`}>
                {notificationCount}
              </span>
            )}
          </li>

          <li
            className="ph-side-item ph-logout"
            onClick={handleLogout}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleLogout()}
          >
            Logout
          </li>
        </ul>
      </nav>
    </aside>
  );
}

Sidebar.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  notificationCount: PropTypes.number,
};
