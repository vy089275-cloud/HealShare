import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import MedicineTable from "./MedicineTable";
import AddMedicineForm from "./AddMedicineForm";
import SearchBar from "./SearchBar";
import FilterDropdown from "./FilterDropdown";
import Sidebar from "./Sidebar";
import "./MedicineDashboard.css";
import { useNavigate } from "react-router-dom";
import PharDashboardBackButton from "../components/PharDashboardBackButton";
import API_URL from "../api";

function MedicineDashboard() {
  const navigate = useNavigate();

  const [medicines, setMedicines] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filter, setFilter] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // pharmacist + token
  const pharmacist = JSON.parse(sessionStorage.getItem("pharmacist"));
  const token = sessionStorage.getItem("token");

  // redirect if missing token or pharmacist
  useEffect(() => {
    if (!token || !pharmacist) navigate("/pharmacist/login");
  }, [token, pharmacist, navigate]);

  const getDaysLeft = (dateStr) => {
    if (!dateStr) return Infinity;
    const today = new Date();
    const expiry = new Date(dateStr);
    const diff = expiry.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const authHeaders = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};

  // ---- FIX: Stable fetch notifications ----
  const fetchNotifications = useCallback(async () => {

    try {
      const res = await axios.get(
        `${API_URL}/notifications/my`,
        authHeaders
      );
      setNotifications(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  }, [token, pharmacist?.id]);

  // ---- FIX: Stable fetch medicines ----
  const fetchMedicinesOnly = useCallback(async () => {
    if (!token) return;

    try {
      const res = await axios.get(
        `${API_URL}/medicines`,
        authHeaders
      );
      setMedicines(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch medicines:", err);
    }
  }, [token]);

  // ---- FIX: Remove infinite loop ----
  useEffect(() => {
    if (!token || !pharmacist?.id) return;

    let cancelled = false;

    const run = async () => {
      try {
        const res = await axios.get(`${API_URL}/medicines`, authHeaders);
        const list = Array.isArray(res.data) ? res.data : [];
        const toDelete = list.filter((m) => getDaysLeft(m.expiry) <= 1);

        if (!cancelled) {
          await fetchMedicinesOnly();
          await fetchNotifications();

          if (toDelete.length > 0) {
            alert("Some medicines auto-removed due to expiry ≤ 1 day.");
          }
        }
      } catch (err) {
        console.error("Error in initial fetch:", err);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [token, pharmacist?.id]); // FIX: removed funcs from dependency array

  const handleAddMedicine = async (medicine) => {
    const daysLeft = getDaysLeft(medicine.expiry);
    if (daysLeft <= 1) {
      alert("Expiry is too near. Cannot add.");
      return;
    }

    try {
      await axios.post(
       `${API_URL}/medicines`,
        { ...medicine },
        authHeaders
      );
      await fetchMedicinesOnly();
      setShowAddForm(false);
    } catch (err) {
      console.error("Failed to add:", err);
      alert("Failed to add medicine");
    }
  };

  const handleBulkEdit = async (editedRows) => {
    try {
      const ids = Object.keys(editedRows);

      for (const id of ids) {
        const expiry = editedRows[id]?.expiry;
        if (expiry && getDaysLeft(expiry) <= 1) {
          alert("Edited medicine expiry ≤ 1 day.");
          return;
        }
      }

      await Promise.all(
        ids.map((id) =>
          axios.put(
           `${API_URL}/medicines/${id}`,
            editedRows[id],
            authHeaders
          )
        )
      );

      alert("Updated successfully!");
      await fetchMedicinesOnly();
      setEditMode(false);
    } catch (err) {
      console.error("Bulk edit error:", err);
      alert("Update failed");
    }
  };

  // ---- FIXED DELETE: No double-delete, no stale selection ----
  const handleBulkDelete = async (ids) => {
    if (!Array.isArray(ids) || ids.length === 0) return;

    try {
      const warnings = [];

      // STEP 1: Preliminary check
      for (const id of ids) {
        const res = await axios.delete(
         `${API_URL}/medicines/${id}?confirm=false`,
          authHeaders
        );
        if (res.data && res.data.includes("⚠️")) warnings.push(res.data);
      }

      let proceed = true;
      if (warnings.length > 0) {
        proceed = window.confirm(
          warnings.join("\n") +
            "\nAre you sure you want to delete these medicines?"
        );
      }

      if (!proceed) return;

      // STEP 2: Actual delete
      await Promise.all(
        ids.map((id) =>
          axios.delete(
            `${API_URL}/medicines/${id}?confirm=true`,
            authHeaders
          )
        )
      );

      alert("Selected medicines deleted!");
      await fetchMedicinesOnly();
      setDeleteMode(false);
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete");
    }
  };

  const computeFiltered = () => {
    let list = [...medicines];

    if (searchText.trim()) {
      const s = searchText.toLowerCase();
      list = list.filter(
        (m) =>
          m.name?.toLowerCase().includes(s) ||
          (s === "free" && m.free) ||
          (s === "discounted" && m.discountedPrice > 0)
      );
    }

    if (filter === "free") list = list.filter((m) => m.free);
    else if (filter === "discounted")
      list = list.filter((m) => m.discountedPrice > 0);
    else if (filter === "price")
      list.sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (filter === "expiry")
      list.sort((a, b) => getDaysLeft(a.expiry) - getDaysLeft(b.expiry));

    return list.map((m) => {
      const days = getDaysLeft(m.expiry);
      return {
        ...m,
        rowClass:
          days <= 10 ? "expire-very-soon" : days <= 30 ? "expire-soon" : "",
      };
    });
  };

  const filtered = computeFiltered();

  return (
    <div className="dashboard-wrapper">
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        notificationCount={notifications.length}
      />

      <div className="dashboard">
        <PharDashboardBackButton />

        <div className="legend">
          <div className="legend-item">
            <div className="legend-circle yellow-circle" />
            <span>Expiry ≤ 30 days</span>
          </div>
          <div className="legend-item">
            <div className="legend-circle orange-circle" />
            <span>Expiry ≤ 10 days</span>
          </div>
        </div>

        <div className="top-bar">
          <button onClick={() => setShowAddForm(true)}>Add</button>

          <button
            onClick={() => {
              setEditMode(true);
              setDeleteMode(false);
              alert("Select medicines to edit");
            }}
          >
            Edit
          </button>

          <button
            onClick={() => {
              setDeleteMode(true);
              setEditMode(false);
            }}
          >
            Delete
          </button>

          {(editMode || deleteMode) && (
            <button
              onClick={() => {
                setEditMode(false);
                setDeleteMode(false);
              }}
            >
              Cancel
            </button>
          )}

          <FilterDropdown filter={filter} setFilter={setFilter} />
        </div>

        <SearchBar searchText={searchText} setSearchText={setSearchText} />

        {showAddForm && (
          <AddMedicineForm
            onSubmit={handleAddMedicine}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        <MedicineTable
          medicines={filtered}
          onBulkEdit={handleBulkEdit}
          onBulkDelete={handleBulkDelete}
          editMode={editMode}
          deleteMode={deleteMode}
        />
      </div>
    </div>
  );
}

export default MedicineDashboard;