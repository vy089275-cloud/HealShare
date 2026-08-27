// src/pharmacist/ProfileModal.js
import React, { useEffect, useRef, useState } from "react";
import "./ProfileModal.css";
import axios from "axios";

export default function ProfileModal({ onClose }) {
  const [pharmacist, setPharmacist] = useState(null);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const wrapperRef = useRef(null);

  // ✅ Click outside → close profile
  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        onClose && onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  // ✅ Fetch profile using JWT
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    axios
      .get("http://localhost:8080/api/pharmacists/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPharmacist(res.data))
      .catch((err) => console.error("Fetch failed:", err));
  }, []);

  if (!pharmacist) {
    return (
      <div className="pm-root" ref={wrapperRef}>
        <div className="pm-loading">Loading...</div>
      </div>
    );
  }

  const handleFieldChange = (field, value) => {
    setPharmacist((p) => ({ ...p, [field]: value }));
  };

  // ✅ Save changes using JWT
  const saveChanges = async () => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.put(
        "http://localhost:8080/api/pharmacists/update",
        {
          pharmacyName: pharmacist.pharmacyName,
          email: pharmacist.email,
          password: pharmacist.password,
          city: pharmacist.city,
          locationLink: pharmacist.locationLink,
          shopPhotoUrls: pharmacist.shopPhotoUrls,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditing(false);
    } catch (err) {
      console.error("Save failed:", err);
      alert("Save failed. Check console.");
    }
  };

  // ✅ Delete account using JWT
  const deleteAccount = async () => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.delete("http://localhost:8080/api/pharmacists/delete", {
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
          <h3>{pharmacist.pharmacyName || "Pharmacy"}</h3>
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
            <label>Pharmacy Name</label>
            {editing ? (
              <input
                value={pharmacist.pharmacyName || ""}
                onChange={(e) =>
                  handleFieldChange("pharmacyName", e.target.value)
                }
              />
            ) : (
              <span>{pharmacist.pharmacyName}</span>
            )}
          </div>

          <div className="pm-row">
            <label>Email</label>
            {editing ? (
              <input
                value={pharmacist.email || ""}
                onChange={(e) => handleFieldChange("email", e.target.value)}
              />
            ) : (
              <span>{pharmacist.email}</span>
            )}
          </div>

          <div className="pm-row">
            <label>Password</label>
            {editing ? (
              <input
                type="text"
                value={pharmacist.password || ""}
                onChange={(e) => handleFieldChange("password", e.target.value)}
              />
            ) : (
              <span>{pharmacist.password.replace(/./g, "*")}</span>
            )}
          </div>

          <div className="pm-row">
            <label>City</label>
            {editing ? (
              <input
                value={pharmacist.city || ""}
                onChange={(e) => handleFieldChange("city", e.target.value)}
              />
            ) : (
              <span>{pharmacist.city || "-"}</span>
            )}
          </div>

          <div className="pm-row">
            <label>Location</label>
            {editing ? (
              <input
                value={pharmacist.locationLink || ""}
                onChange={(e) =>
                  handleFieldChange("locationLink", e.target.value)
                }
              />
            ) : pharmacist.locationLink ? (
              <a
                href={pharmacist.locationLink}
                target="_blank"
                rel="noreferrer"
              >
                View on map
              </a>
            ) : (
              <span>-</span>
            )}
          </div>

          {/* ✅ Shop photos */}
          {pharmacist.shopPhotoUrls && pharmacist.shopPhotoUrls.length > 0 && (
            <div className="pm-photos">
              {pharmacist.shopPhotoUrls.map((url, i) => (
                <img key={i} src={url} alt={`shop ${i}`} />
              ))}
            </div>
          )}

          {/* ✅ Confirmation box */}
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