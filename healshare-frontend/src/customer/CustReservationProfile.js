import React from "react";
import "./CustReservationProfile.css";

function CustReservationProfile({ data, onClose }) {
  if (!data) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">

        <button className="close-btn" onClick={onClose}>X</button>

        <h2>{data.shopName}</h2>

        <p><strong>City:</strong> {data.city}</p>

        <p>
          <strong>Location:</strong>{" "}
          {data.locationLink ? (
            <a href={data.locationLink} target="_blank" rel="noopener noreferrer">
              View in Map
            </a>
          ) : (
            "-"
          )}
        </p>

        <div className="photos-section">
          <h3>Shop Photos</h3>

          {data.shopPhotos && data.shopPhotos.length > 0 ? (
            <div className="photos-grid">
              {data.shopPhotos.map((photo, i) => (
                <img
                  key={i}
                  src={photo}
                  alt="shop"
                  className="shop-photo"
                />
              ))}
            </div>
          ) : (
            <p>No photos available</p>
          )}
        </div>

      </div>
    </div>
  );
}

export default CustReservationProfile;