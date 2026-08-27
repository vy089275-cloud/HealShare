// src/customer/CustomerMedicines.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import CustomerMedicineCard from "./CustomerMedicineCard";
import PharProfileModal from "./PharProfileModal";
import "./customerStyles.css";
import CustDashboardBackButton from "../components/CustDashboardBackButton";


function CustomerMedicines() {
const [medicines, setMedicines] = useState([]);
const [search, setSearch] = useState("");
const [filter, setFilter] = useState("all");
const [reserveMode, setReserveMode] = useState(false);
const [selected, setSelected] = useState({});
const [profileModalData, setProfileModalData] = useState(null);

useEffect(() => {
fetchMedicines();
}, []);

const fetchMedicines = async () => {
try {
const token = sessionStorage.getItem("token");
const res = await axios.get("http://localhost:8080/medicines/all", {
headers: { Authorization: `Bearer ${token}` },
});
setMedicines(res.data || []);
} catch (err) {
console.error("Fetch medicines error:", err);
}
};

const toggleCardCheck = (medId) => {
setSelected((prev) => {
const copy = { ...prev };
if (copy[medId]) delete copy[medId];
else copy[medId] = { checked: true, qty: 1 };
return copy;
});
};

const updateQty = (medId, qty) => {
setSelected((prev) => ({
...prev,
[medId]: { ...(prev[medId] || { checked: true }), qty: Number(qty) },
}));
};

const filtered = medicines
.filter((m) => {
if (!search) return true;
const s = search.toLowerCase();
return (
(m.name || m.medicineName || "").toLowerCase().includes(s) ||
(m.pharmacist?.pharmacyName || "").toLowerCase().includes(s)
);
})
.filter((m) => {
if (filter === "all") return true;
if (filter === "free")
return m.free || Number(m.price) === 0;
if (filter === "discounted") {
    return m.discountedPrice && Number(m.discountedPrice) > 0;
}
if (filter === "price")
return !m.free && (!m.discountedPrice || Number(m.discountedPrice) === 0);
if (filter === "expiry") return true;
return true;
})
.sort((a, b) => {
  // --- EXPIRY SORT ---
  if (filter === "expiry") {
    const e1 = new Date(a.expiry);
    const e2 = new Date(b.expiry);
    return e1 - e2;
  }

  // --- PRICE or DISCOUNTED PRICE SORT ---
  if (filter === "price" || filter === "discounted") {
    const priceA =
      a.discountedPrice !== null && a.discountedPrice > 0
        ? a.discountedPrice
        : a.price;

    const priceB =
      b.discountedPrice !== null && b.discountedPrice > 0
        ? b.discountedPrice
        : b.price;

    return priceA - priceB;
  }

  // --- DEFAULT: SORT BY NAME ---
  return (a.name || "").localeCompare(b.name || "");
});

const handleReserve = async () => {
  try {
    const token = sessionStorage.getItem("token");
    const customer = JSON.parse(sessionStorage.getItem("customer"));

    if (!customer || !customer.id) {
      alert("Customer not found in session. Please login again.");
      return;
    }

    const items = Object.entries(selected).map(([medId, data]) => ({
      medicineId: Number(medId),
      quantity: Number(data.qty),
    }));

    if (items.length === 0) {
      alert("Select at least one medicine to reserve.");
      return;
    }

    setReserveMode(false);


    // --- Send all requests simultaneously for speed ---
    await Promise.all(
      items.map((item) =>
        axios.post(
          "http://localhost:8080/reservations",
          {
            customerId: customer.id,
            medicineId: item.medicineId,
            quantity: item.quantity,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
      )
    );

    // --- Refetch updated stock from backend ---
    await fetchMedicines();

    alert("Reserved successfully!");
    setSelected({});
  } catch (err) {
    console.error("Reserve error:", err);
    alert("Reservation failed. Data refreshed.");

    try { await fetchMedicines(); } catch (e) {}
  }
};

return (
<div className="customer-meds-container page-wrapper">
  <CustDashboardBackButton/>
{/* PROFILE MODAL */}
{profileModalData && (
<PharProfileModal
data={profileModalData}
onClose={() => setProfileModalData(null)}
/>
)}

  {/* TOP BAR */}
  <div className="customer-top-bar">
    <button
      className="reserve-btn"
      onClick={() => setReserveMode(!reserveMode)}
    >
      {reserveMode ? "Exit Reserve" : "Reserve Medicines"}
    </button>

    <input
      placeholder="Search by medicine or pharmacy..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="customer-search"
    />

    <select
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
      className="customer-filter"
    >
      <option value="all">All</option>
      <option value="free">Free</option>
      <option value="discounted">Discounted</option>
      <option value="price">Price</option>
      <option value="expiry">Expiry</option>
    </select>
  </div>

  {/* MEDICINE GRID */}
  <div className="medicines-grid">
    {filtered.map((med) => (
      <CustomerMedicineCard
        key={med.id}
        medicine={med}
        reserveMode={reserveMode}
        isChecked={!!selected[med.id]}
        onCheck={() => toggleCardCheck(med.id)}
        onQtyChange={(q) => updateQty(med.id, q)}
        onProfileClick={(data) => setProfileModalData(data)}
      />
    ))}
  </div>

  {/* RESERVE CONFIRM BUTTON */}
{reserveMode && Object.keys(selected).length > 0 && (
  <button
    className="confirm-reserve-btn"
    onClick={handleReserve}
  >
    Confirm Reservation ({Object.keys(selected).length})
  </button>
)}

  {/* EXPIRY LEGEND */}
  <div className="expiry-legend floating-legend">
    <div className="legend-item">
      <span className="legend-circle orange"></span>
      <span>Expiry in 10 days</span>
    </div>

    <div className="legend-item">
      <span className="legend-circle yellow"></span>
      <span>Expiry in 30 days</span>
    </div>
  </div>
</div>

);
}

export default CustomerMedicines;