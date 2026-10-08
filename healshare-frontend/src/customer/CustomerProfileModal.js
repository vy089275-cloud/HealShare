// src/customer/CustomerProfileModal.js
import React, { useEffect, useRef, useState } from "react";
import "./CustomerProfileModal.css";
import axios from "axios";
import API_URL from "../api";

export default function CustomerProfileModal({ onClose }) {
  const [customer, setCustomer] = useState(null);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const wrapperRef = useRef(null);

  // Click outside → close
  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        onClose && onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  // Fetch customer profile using JWT
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    axios
      .get(`${API_URL}/api/customers/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCustomer(res.data))
      .catch((err) => console.error("Fetch failed:", err));
  }, []);

  if (!customer) {
    return (
      <div className="pm-root" ref={wrapperRef}>
        <div className="pm-loading">Loading...</div>
      </div>
    );
  }

  const handleFieldChange = (field, value) => {
    setCustomer((p) => ({ ...p, [field]: value }));
  };

  // Save changes using JWT
  const saveChanges = async () => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.put(
        `${API_URL}/api/customers/update`,
        {
          name: customer.name,
          email: customer.email,
          password: customer.password,
          district: customer.district,
          taluk: customer.taluk,
          village: customer.village,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditing(false);
    } catch (err) {
      console.error("Save failed:", err);
      alert("Save failed. Check console.");
    }
  };

  // Delete account using JWT
  const deleteAccount = async () => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(`${API_URL}/api/customers/delete`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      sessionStorage.removeItem("token");
      window.location.href = "/";
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed. Check console.");
    }
  };

  return (
    <div className="pm-root">
      <div className="pm-card" ref={wrapperRef}>
        <div className="pm-header">
          <h3>{customer.name || "Customer"}</h3>
          <div className="pm-actions">
            <button
              className="pm-edit-btn"
              onClick={() => (editing ? saveChanges() : setEditing(true))}
            >
              {editing ? "Save" : "Edit"}
            </button>

            <button
              className="pm-delete-btn"
              onClick={() => setConfirmDelete((s) => !s)}
            >
              Delete
            </button>
          </div>
        </div>

        <div className="pm-body">
          <div className="pm-row">
            <label>Name</label>
            {editing ? (
              <input
                value={customer.name || ""}
                onChange={(e) => handleFieldChange("name", e.target.value)}
              />
            ) : (
              <span>{customer.name}</span>
            )}
          </div>

          <div className="pm-row">
            <label>Email</label>
            {editing ? (
              <input
                value={customer.email || ""}
                onChange={(e) => handleFieldChange("email", e.target.value)}
              />
            ) : (
              <span>{customer.email}</span>
            )}
          </div>

          <div className="pm-row">
            <label>Password</label>
            {editing ? (
              <input
                type="text"
                value={customer.password || ""}
                onChange={(e) => handleFieldChange("password", e.target.value)}
              />
            ) : (
              <span>{customer.password ? customer.password.replace(/./g, "*") : ""}</span>
            )}
          </div>

          <div className="pm-row">
            <label>District</label>
            {editing ? (
              <input
                value={customer.district || ""}
                onChange={(e) => handleFieldChange("district", e.target.value)}
              />
            ) : (
              <span>{customer.district || "-"}</span>
            )}
          </div>

          <div className="pm-row">
            <label>Taluk</label>
            {editing ? (
              <input
                value={customer.taluk || ""}
                onChange={(e) => handleFieldChange("taluk", e.target.value)}
              />
            ) : (
              <span>{customer.taluk || "-"}</span>
            )}
          </div>

          <div className="pm-row">
            <label>Village</label>
            {editing ? (
              <input
                value={customer.village || ""}
                onChange={(e) => handleFieldChange("village", e.target.value)}
              />
            ) : (
              <span>{customer.village || "-"}</span>
            )}
          </div>

          {/* Confirmation box */}
          {confirmDelete && (
            <div className="pm-confirm">
              <p>Are you sure you want to permanently delete your account?</p>
              <div className="pm-confirm-actions">
                <button className="pm-confirm-yes" onClick={deleteAccount}>
                  Yes, delete
                </button>
                <button
                  className="pm-confirm-no"
                  onClick={() => setConfirmDelete(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}