import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import API_URL from "../api";
import "./CustomerSignup.css";


  function CustomerSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    district: "",
    taluk: "",
    village: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setMessage("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!form.name || !form.email || !form.password) {
      setMessage("Please fill required fields (Name, Email, Password).");
      return;
    }
    try {
      const res = await axios.post(`${API_URL}/api/customers/signup`, form);
      setMessage(res?.data || "Customer Registered Successfully!");
      if (res.status === 200) {
        setTimeout(() => navigate("/customer/login"), 800);
      }
    } catch (err) {
      const text = err?.response?.data || "Registration failed";
      setMessage(text);
    }
  };

  return (
    <div className="auth-page">
      <div className="card">
        <BackButton />
        <h2>Customer Signup</h2>

        <form className="form" onSubmit={handleSubmit}>
          <input name="name" placeholder="Full Name" onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
          <input name="district" placeholder="District" onChange={handleChange} />
          <input name="taluk" placeholder="Taluk" onChange={handleChange} />
          <input name="village" placeholder="Village" onChange={handleChange} />

          <button className="primary" type="submit">Sign Up</button>

          {message && <p className="message">{message}</p>}
        </form>

        <p className="alt-link">
          Already have an account? <Link to="/customer/login" className="blue">Login</Link>
        </p>
      </div>
    </div>
  );
}
export default CustomerSignup;