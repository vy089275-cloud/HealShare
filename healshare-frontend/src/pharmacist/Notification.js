import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./Notification.css";
import { toast } from "react-toastify";
import PharDashboardBackButton from "../components/PharDashboardBackButton";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:8080/notifications/my", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      setNotifications(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      toast.error("Failed to load notifications");
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAllRead = async () => {
    try {
      await axios.put(
        "http://localhost:8080/notifications/mark-all-read",
        {},
        { headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` } }
      );
      toast.success("All notifications marked as read");
      fetchNotifications();
    } catch (err) {
      console.error("Failed to mark read:", err);
      toast.error("Failed");
    }
  };

  const clearAll = async () => {
    if (!window.confirm("Delete all notifications?")) return;

    try {
      await axios.delete("http://localhost:8080/notifications/clear", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      toast.success("Notifications cleared");
      fetchNotifications();
    } catch (err) {
      console.error("Failed to clear:", err);
      toast.error("Failed");
    }
  };

  return (
    <div className="notif-container">
       <PharDashboardBackButton />
      <h2 className="notif-title">Notifications</h2>

      <div className="top-actions">
        <button className="mark-read-btn" onClick={markAllRead}>
          Mark All Read
        </button>

        <button className="clear-btn" onClick={clearAll}>
          Clear All
        </button>
      </div>

      {notifications.length === 0 ? (
        <p className="notif-empty">No notifications available</p>
      ) : (
        <ul className="notif-list">
          {notifications.map((n) => (
            <li key={n.id} className={`notif-item ${n.readStatus ? "read" : "unread"}`}>
              <div className="notif-reason">{n.message}</div>
              <div className="notif-time">
                {n.timestamp ? new Date(n.timestamp).toLocaleString() : ""}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
