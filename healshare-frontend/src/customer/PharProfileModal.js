// src/customer/PharProfileModal.js
import React, { useEffect, useRef } from "react";
import "./PharProfileModal.css";

export default function PharProfileModal({ data, onClose }) {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  const profile = data; // ✅ use the passed object directly

  if (!profile) {
    return (
      <div className="pm-root">
        <div className="pm-card" ref={wrapperRef}>
          <div className="pm-loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="pm-root">
      <div className="pm-card" ref={wrapperRef}>
        <div className="pm-header">
          <div style={{ display: "flex",alignItems: "center",justifyContent:"center",position:"relative", gap: "12px",padding:"10px 20px",borderBottom:"1px solid #ddd" }}>
            <h3>{profile.pharmacyName || "Pharmacy"}</h3>
          </div>
          <button
            onClick={onClose}
            style={{
              position:"absolute",
              right:"20px",
              background: "none",
              border: "none",
              fontSize: "22px",
              cursor: "pointer",
              color: "#444",
              fontWeight: "bold",
            }}
          >
            ×
          </button>
        </div>

        <div className="pm-body">
          <div className="pm-row">
            <label>City</label>
            <span>{profile.city || "-"}</span>
          </div>

          <div className="pm-row">
            <label>Location</label>
            {profile.locationLink ? (
              <a href={profile.locationLink} target="_blank" rel="noreferrer" style={{color:"blue",textDecoration:"underline",cursor:"pointer"}}>
                View on map
              </a>
            ) : (
              <span>-</span>
            )}
          </div>

          {profile.shopPhotoUrls && profile.shopPhotoUrls.length > 0 && (
            <div className="pm-photos">
              {profile.shopPhotoUrls.map((url, i) => (
                <img key={i} src={url} alt={`shop-${i}`} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}