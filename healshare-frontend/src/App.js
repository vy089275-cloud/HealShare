import React from "react"; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import WelcomePage from "./pages/WelcomePage";
import PharmacistLogin from "./pages/PharmacistLogin";
import PharmacistSignup from "./pages/PharmacistSignup";
import CustomerLogin from "./pages/CustomerLogin";
import CustomerSignup from "./pages/CustomerSignup";
import PharmacistDashboard from "./pharmacist/PharmacistDashboard";
import CustomerDashboard from "./customer/CustomerDashboard";
import MedicineDashboard from "./pharmacist/MedicineDashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Notification from "./pharmacist/Notification";
import CustomerMedicines from "./customer/CustomerMedicines";
import PharmacistReservations from "./pharmacist/PharmacistReservations";
import CustomerReservations from "./customer/CustomerReservations";


function App() {
  return (
    <Router>
       <ToastContainer position="top-right" autoClose={2000} />
      <Routes>
        {/* Default welcome screen */}
        <Route path="/" element={<WelcomePage />} />

        {/* Pharmacist routes */}
        <Route path="/pharmacist/login" element={<PharmacistLogin />} />
        <Route path="/pharmacist/signup" element={<PharmacistSignup />} />
        <Route path="/pharmacist/medicines" element={<MedicineDashboard />} />
        <Route path="/pharmacist/notifications" element={<Notification />} />
        <Route path="/pharmacist/dashboard" element={<PharmacistDashboard />} />
        <Route path="/pharmacist/reservations" element={<PharmacistReservations />} />

        {/* Customer routes */}
        <Route path="/customer/login" element={<CustomerLogin />} />
        <Route path="/customer/signup" element={<CustomerSignup />} />
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/customer/medicines" element={<CustomerMedicines />} />
        <Route path="/customer/reservations" element={<CustomerReservations />} />


      </Routes>
    </Router>
  );
}

export default App;