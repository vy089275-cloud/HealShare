import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import API_URL from "../api";
import "./PharmacistSignup.css";

  function PharmacistSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    pharmacyName: "",
    email: "",
    password: "",
    city: "",
    locationLink: "",
  });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [message, setMessage] = useState(""); // show backend or client messages

  const MAX_FILES = 3;
  const MAX_SIZE = 3 * 1024 * 1024; // 3MB

  const handleChange = (e) => {
    setMessage("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setMessage("");
    const chosen = Array.from(e.target.files || []);
    if (chosen.length === 0) {
      setFiles([]);
      setPreviews([]);
      return;
    }
    if (chosen.length > MAX_FILES) {
      setMessage("You can upload a maximum of 3 photos.");
      return;
    }
    for (let f of chosen) {
      const name = f.name.toLowerCase();
      if (!(name.endsWith(".jpg") || name.endsWith(".jpeg"))) {
        setMessage("Only JPG/JPEG files allowed.");
        return;
      }
      if (f.size > MAX_SIZE) {
        setMessage("Each file must be ≤ 3 MB.");
        return;
      }
    }
    setFiles(chosen);

    // generate previews
    const readers = chosen.map(
      (file) =>
        new Promise((res) => {
          const r = new FileReader();
          r.onload = () => res(r.result);
          r.readAsDataURL(file);
        })
    );
    Promise.all(readers).then((imgs) => setPreviews(imgs));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!form.pharmacyName || !form.email || !form.password) {
      setMessage("Please fill required fields (Name, Email, Password).");
      return;
    }
    if (files.length === 0) {
      setMessage("Please select at least one JPG photo (up to 3).");
      return;
    }

    try {
      const fd = new FormData();
      fd.append("pharmacist", new Blob([JSON.stringify(form)], { type: "application/json" }));
      files.forEach((f) => fd.append("photos", f));

      const res = await axios.post(`${API_URL}/api/pharmacists/signup`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 120000,
      });

      setMessage(res.data?.message || res.data?.message || "Pharmacist Registered Successfully!");
      if (res.status === 200) {
        setTimeout(() => navigate("/pharmacist/login"), 800);
      }
    } catch (err) {
      const text = err?.response?.data?.error || err?.response?.data?.message || "Registration failed. Try again.";
      setMessage(text);
    }
  };

  return (
    <div className="auth-page">
      <div className="card">
        <BackButton />
        <h2>Pharmacist Signup</h2>

        <form className="form" onSubmit={handleSubmit}>
          <input name="pharmacyName" placeholder="Pharmacy Name" onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
          <input name="city" placeholder="City" onChange={handleChange} />
          <input name="locationLink" placeholder="Location Link (Google Maps link)" onChange={handleChange} />

          <label className="file-label">
            Choose up to 3 Pharmacy photos (jpg/jpeg) (each ≤ 3MB)
            <input type="file" accept=".jpg,.jpeg" multiple onChange={handleFileChange} />
          </label>

          <div className="previews">
            {previews.map((p, i) => (
              <img key={i} src={p} alt={`preview-${i}`} />
            ))}
          </div>

          <button type="submit" className="primary">Sign Up</button>

          {message && <p className="message">{message}</p>}
        </form>

        <p className="alt-link">
          Already have an account?{" "}
          <Link to="/pharmacist/login" className="blue">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default PharmacistSignup; 