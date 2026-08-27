import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "../customer/customerStyles.css";
import profileIcon from "../assets/profile-icon.png";
import CustReservationProfile from "./CustReservationProfile";
import CustDashboardBackButton from "../components/CustDashboardBackButton";

function CustomerReservations() {
  const [reservations, setReservations] = useState([]);
  const [pharmaModalData, setPharmaModalData] = useState(null);

  const alertShown = useRef(false);

  const customer = JSON.parse(sessionStorage.getItem("customer") || "{}");
  const customerId = customer?.id;
  const token = sessionStorage.getItem("token");

  useEffect(() => {
  if (!customerId) return;

  fetchReservations();

  const interval = setInterval(() => {
    fetchReservations();
  }, 3000);

  if (!alertShown.current) {
    alert("Collect approved medicines within 15 days to avoid cancellation.");
    alertShown.current = true;
  }

  return () => clearInterval(interval);
}, [customerId]);

  const fetchReservations = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/reservations/customer/${customerId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReservations(res.data || []);
    } catch (err) {
      console.error("Fetch customer reservations error:", err);
    }
  };

  return (
    <div className="reservations-page">
      <CustDashboardBackButton />

      {/* MODAL */}
      {pharmaModalData && (
        <CustReservationProfile
          data={pharmaModalData}
          onClose={() => setPharmaModalData(null)}
        />
      )}

      <h2>Your Reservations</h2>

      <table className="reservations-table">
        <thead>
          <tr>
            <th>Medicine</th>
            <th>Qty</th>
            <th>Total Price</th>
            <th>Pharmacy</th>
            <th>Approved At</th>
            <th>Expiry</th>
          </tr>
        </thead>

        <tbody>
          {reservations.map((r) => (
            <tr key={r.id}>
              <td>{r.medicineName}</td>
              <td>{r.quantity}</td>
              <td>{r.totalPrice === 0 ? "Free" : `₹${r.totalPrice}`}</td>

              {/* PHARMACY */}
              <td>
                <img
                  src={r.pharmacyProfile || profileIcon}
                  className="small-avatar"
                  alt="pharmacy"
                  onClick={() =>
                    setPharmaModalData({
                      shopName: r.pharmacyName,
                      city: r.pharmacyCity,
                      locationLink: r.pharmacyLocationLink,
                      shopPhotos: Array.isArray(r.pharmacyPhotos)
                        ? r.pharmacyPhotos.filter(p => p) // REMOVE null/undefined
                        : r.pharmacyPhotos
                        ? [r.pharmacyPhotos] // single value → convert to array
                        : [], // fallback → empty list
                    })
                  }
                />
                <span>{r.pharmacyName}</span>
              </td>

              <td>{r.approvedAt || "Pending"}</td>
              <td>{r.expiryDate || "Unknown"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerReservations;