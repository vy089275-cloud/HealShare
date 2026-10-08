// src/pharmacist/PharmacistReservations.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import PharReservationProfile from "./PharReservationProfile"; // pharmacist profile modal
import "../customer/customerStyles.css";
import profileIcon from "../assets/profile-icon.png";
import PharDashboardBackButton from "../components/PharDashboardBackButton";
import API_URL from "../api";

function PharmacistReservations() {
  const [reservations, setReservations] = useState([]);
  const [profileModalData, setProfileModalData] = useState(null);

  const pharmacist = JSON.parse(sessionStorage.getItem("pharmacist") || "{}");
  const pharmacistId = pharmacist?.id;
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (pharmacistId) fetchReservations();
  }, [pharmacistId]);

  const fetchReservations = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/reservations/pharmacist/${pharmacistId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReservations(res.data || []);
    } catch (err) {
      console.error("Fetch reservations (pharmacist) error:", err);
    }
  };

  const handleApprove = async (resId) => {
    try {
      await axios.put(
       `${API_URL}/reservations/${resId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchReservations();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCollected = async (resId) => {
  try {
    await axios.put(
      `${API_URL}/reservations/${resId}/collected`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Refresh reservations
    fetchReservations();

    // Show success message
    alert("Reserved medicine collected successfully!");
  } catch (err) {
    console.error(err);
    alert("Failed to collect reservation. Please try again.");
  }
};
  return (
    <div className="reservations-page">
        <PharDashboardBackButton/>
      {/* PROFILE MODAL */}
      {profileModalData && (
        <PharReservationProfile
          data={profileModalData}
          onClose={() => setProfileModalData(null)}
        />
      )}

      <div style={{height:"20px"}}></div>

      <table className="reservations-table">
        <thead>
          <tr>
            <th>Medicine</th>
            <th>Reserved Qty</th>
            <th>Total Price</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((r) => (
            <tr key={r.id}>
              <td>{r.medicineName}</td>
              <td>{r.quantity}</td>
              <td>{r.totalPrice === 0 ? "Free" : `₹${r.totalPrice}`}</td>
              <td>
                <img
                  src={r.customerProfile || profileIcon}
                  alt="c"
                  className="small-avatar"
                  onClick={() =>
                    setProfileModalData({
                      village: r.customerVillage,
                      taluk: r.customerTaluk,
                      district: r.customerDistrict,
                    })
                  }
                />
                <span>{r.customerName}</span>
              </td>
              <td>{r.status}</td>
              <td>
                {r.status === "PENDING" && (
                  <button className="action-btn" onClick={() => handleApprove(r.id)}>
                    Approve
                  </button>
                )}
                {r.status === "APPROVED" && (
                  <button className="action-btn" onClick={() => handleCollected(r.id)}>
                    Collected
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PharmacistReservations;