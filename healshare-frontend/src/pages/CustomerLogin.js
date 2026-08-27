import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import "./CustomerLogin.css";

function CustomerLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post(
        "http://localhost:8080/api/customers/login",
        { email, password },
        { withCredentials: false }
      );

      // If server sends error inside response body
      if (res.data.error) {
        setMessage(res.data.error);
        return;
      }

      // If login successful
      if (res.data.token) {
        sessionStorage.setItem("token", res.data.token);

        // Save customer details if backend sends it
        if (res.data.customer) {
          sessionStorage.setItem(
            "customer",
            JSON.stringify(res.data.customer)
          );
        }

        setMessage("Login successful");

        setTimeout(() => navigate("/customer/dashboard"), 700);
      } else {
        setMessage("Unexpected server response");
      }
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Customer does not exist";

      setMessage(msg);
    }
  };

  return (
    <div className="auth-page">
      <div className="card">
        <BackButton />
        <h2>Customer Login</h2>

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
          <Link to="/customer/signup" className="blue">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default CustomerLogin;