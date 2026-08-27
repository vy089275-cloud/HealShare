// src/pharmacist/PharReservationProfile.js
import React from "react";
import "../customer/customerStyles.css";

function PharReservationProfile({ data, onClose }) {
if (!data) return null;

const { village, taluk, district } = data;

return (
<div className="modal-overlay">
<div className="modal-content">
<h3>Customer Profile</h3>
<div className="profile-detail">
<strong>Village:</strong> {village || "N/A"}
</div>
<div className="profile-detail">
<strong>Taluk:</strong> {taluk || "N/A"}
</div>
<div className="profile-detail">
<strong>District:</strong> {district || "N/A"}
</div>
<button className="close-btn" onClick={onClose}aria-label="Close">
X
</button>
</div>
</div>
);
}

export default PharReservationProfile;