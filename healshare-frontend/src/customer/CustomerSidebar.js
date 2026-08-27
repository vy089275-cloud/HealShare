import React from "react";
import "./CustomerSidebar.css";
import { useNavigate } from "react-router-dom";

export default function CustomerSidebar({ open, setOpen }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/");
  };

  const goToMedicines = () => {
    navigate("/customer/medicines");
    setOpen(false);
  };

  const goToReservations = () => {
    navigate("/customer/reservations");
    setOpen(false);
  };

  return (
    <aside className={`ph-sidebar ${open ? "open" : ""}`}>
      {open && (
        <button
          className="ph-sidebar-close"
          onClick={() => setOpen(false)}
          aria-label="Close sidebar"
        >
          ✕
        </button>
      )}

      <nav className="ph-side-nav">
        <ul>
          <li className="ph-side-item" onClick={goToMedicines}>
            Medicines
          </li>

          <li className="ph-side-item" onClick={goToReservations}>
            Reservations
          </li>


          <li className="ph-side-item ph-logout" onClick={handleLogout}>
            Logout
          </li>
        </ul>
      </nav>
    </aside>
  );
}