import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import API_URL from "../api";
import "./PharmacistLogin.css";

function PharmacistLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post(
        `${API_URL}/api/pharmacists/login`,
        { email, password },
        { withCredentials: false }
      );

      // If backend sends error message
      if (res.data.error) {
        setMessage(res.data.error);
        return;
      }

      // If login is successful
      if (res.data.token) {
        sessionStorage.setItem("token", res.data.token);

        // Save pharmacist details
        if (res.data.pharmacist) {
          sessionStorage.setItem(
            "pharmacist",
            JSON.stringify(res.data.pharmacist)
          );
        }

        setMessage("Login successful");
        setTimeout(() => navigate("/pharmacist/dashboard"), 700);
      } else {
        setMessage("Unexpected server response");
      }
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Pharmacist does not exist";
      setMessage(msg);
    }
  };

  return (
    <div className="auth-page">
      <div className="card">
        <BackButton />
        <h2>Pharmacist Login</h2>

        <form className="form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="primary" type="submit">
            Login
          </button>

          {message && <p className="message">{message}</p>}
        </form>

        <p className="alt-link">
          Don’t have an account?{" "}
          <Link to="/pharmacist/signup" className="blue">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default PharmacistLogin;
