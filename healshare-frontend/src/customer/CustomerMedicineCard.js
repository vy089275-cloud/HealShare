// src/customer/CustomerMedicineCard.js
import React from "react";
import "./customerStyles.css";
import profileIcon from "../assets/profile-icon.png";

function CustomerMedicineCard({
medicine,
reserveMode,
isChecked,
onCheck,
onQtyChange,
onProfileClick,
}) {
const name = medicine.name || medicine.medicineName || "Unknown";
const pharmacyName = medicine.pharmacist?.pharmacyName || "Pharmacy"; // ✅ use nested pharmacist
const qty = medicine.quantity ?? medicine.qty ?? 0;

const expiry = medicine.expiry || medicine.expiryDate || "";
const daysLeft = Math.ceil(
(new Date(expiry) - new Date()) / (1000 * 60 * 60 * 24)
);

const edgeClass =
daysLeft <= 10 ? "orange-edge" : daysLeft <= 30 ? "yellow-edge" : "";

const isFree =
medicine.free ||
Number(medicine.price) === 0;

const discounted = medicine.discountedPrice ?? null;

// prepare data for modal from nested pharmacist
const pharmacyData = {
pharmacyName: medicine.pharmacist?.pharmacyName || "",
city: medicine.pharmacist?.city || "",
locationLink: medicine.pharmacist?.locationLink || "",
shopPhotoUrls: medicine.pharmacist?.shopPhotoUrls || [],
};

return (
<div className={`medicine-card ${edgeClass}`}>
  {reserveMode && (
    <input
      type="checkbox"
      checked={isChecked}
      onChange={onCheck}
      className="reserve-checkbox"
      disabled={qty === 0} // disable if out of stock
    />
  )}

  <div className="pharmacy-header">
    <img
      src={profileIcon}
      alt={pharmacyName}
      className="pharmacy-icon"
      onClick={() => onProfileClick(pharmacyData)}
    />
    <div
      className="pharmacy-name"
      onClick={() => onProfileClick(pharmacyData)}
    >
      {pharmacyName}
    </div>
  </div>

  <h3 className="med-name">{name}</h3>

  <p className="med-detail">
    <strong>Quantity:</strong> {qty} {qty === 0 && <span className="out-of-stock-label">(Out of Stock)</span>}
  </p>

  <p className="med-detail">
    <strong>Expiry:</strong> {expiry} ({daysLeft}d)
  </p>

  <p className="med-detail">
    <strong>Price:</strong>{" "}
    {isFree ? (
      <span className="free-label">Free</span>
    ) : discounted ? (
      <>
        <span className="strike">₹{medicine.price}</span>
        <span className="discounted"> ₹{discounted}</span>
      </>
    ) : (
      <>₹{medicine.price}</>
    )}
  </p>

  {reserveMode && isChecked && (
    <div className="qty-input-wrapper">
      <input
        type="number"
        min="1"
        max={qty}
        placeholder="Required Qty"
        className="qty-input"
        onChange={(e) =>
          onQtyChange(Math.max(1, Math.min(Number(e.target.value || 1), qty)))
        }
      />
    </div>
  )}
</div>
);
}

export default CustomerMedicineCard;