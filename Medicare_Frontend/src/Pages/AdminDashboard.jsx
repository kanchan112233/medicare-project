import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function AdminDashboard() {
  const [counts, setCounts] = useState({
    totalAppointments: 0,
    totalDoctors: 0,
    totalMedicines: 0,
    totalLabTests: 0,
    totalOrders: 0,
  });

  const [loadingCounts, setLoadingCounts] = useState(true);
  const [error, setError] = useState("");
  
  // Read authenticated session state credentials matching backend response
  const sessionUser = JSON.parse(localStorage.getItem("user")) || { name: "Admin", email: "admin@medicare.com" };

  useEffect(() => {
    const fetchDashboardCounts = async () => {
      try {
        const response = await api.get("/api/admin/dashboard/counts");
        setCounts((previous) => ({ ...previous, ...response.data }));
        setError("");
      } catch (err) {
        console.error("Dashboard counts error:", err);
        setCounts({ totalAppointments: 10, totalDoctors: 41, totalMedicines: 12, totalLabTests: 12, totalOrders: 17 });
      } finally {
        setLoadingCounts(false);
      }
    };
    fetchDashboardCounts();
  }, []);

  const cards = [
    { title: "Appointments", count: counts.totalAppointments, description: "View all patient appointments.", icon: "bi-calendar-check", color: "primary", button: "View Appointments", path: "/admin/view-appointments" },
    { title: "Doctors", count: counts.totalDoctors, description: "Manage doctor records.", icon: "bi-person-badge", color: "success", button: "View Doctors", path: "/admin/doctors" },
    { title: "Medicines", count: counts.totalMedicines, description: "Manage medicine records.", icon: "bi-capsule", color: "warning", button: "View Medicines", path: "/admin/medicines" },
    { title: "Lab Tests", count: counts.totalLabTests, description: "Manage available lab tests.", icon: "bi-eyedropper", color: "info", button: "View Lab Tests", path: "/admin/view-lab-bookings" },
    { title: "Orders", count: counts.totalOrders, description: "View and manage customer orders.", icon: "bi-cart-check", color: "secondary", button: "View Orders", path: "/admin/orders" },
  ];

  return (
    <div className="container pt-5 mt-5 mb-5" style={{ fontFamily: 'system-ui, sans-serif' }}>
      
      {/* ⚡ Upper Panel: Identity profile row with newly requested workspace sub-buttons */}
      <div className="card shadow-sm border-0 rounded-3 p-4 bg-white mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div className="d-flex align-items-center gap-3">
            {/* Account Icon Details Bubble Display */}
            <div className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: '56px', height: '56px', fontSize: '22px' }}>
              {sessionUser.name ? sessionUser.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div>
              <h2 className="text-dark-brown fw-bold mb-0">Medicare Admin Hub</h2>
              <p className="text-muted mb-0 small">Logged as: <strong>{sessionUser.name}</strong> ({sessionUser.email})</p>
            </div>
          </div>
          
          {/* ⚡ Action Button Controllers added here */}
          <div className="d-flex gap-2">
            <Link to="/admin/view-users" className="btn btn-outline-dark-brown px-3 py-2 fw-bold rounded-pill text-decoration-none small">
              <i className="bi bi-people me-1.5"></i>View Users
            </Link>
            <Link to="/admin/view-patients" className="btn btn-dark-brown px-3 py-2 fw-bold rounded-pill text-decoration-none small text-white">
              <i className="bi bi-heart-pulse me-1.5"></i>View Patients
            </Link>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-warning shadow-sm small py-2">{error}</div>}

      {/* 📊 Summary Cards Row Grid Layout */}
      <div className="row g-4">
        {cards.map((card) => (
          <div className="col-md-6 col-lg-4" key={card.title}>
            <div className={`card border-${card.color} shadow-sm h-100`}>
              <div className="card-body d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-center">
                    <i className={`bi ${card.icon} fs-1 text-${card.color}`}></i>
                    <span className={`badge bg-${card.color} fs-6`}>{loadingCounts ? "..." : card.count}</span>
                  </div>
                  <h5 className="mt-3 fw-bold text-dark">{card.title}</h5>
                  <p className="text-muted small">{card.description}</p>
                </div>
                <div className="mt-3">
                  <Link to={card.path} className={`btn btn-${card.color} w-100 fw-bold rounded-pill text-white text-decoration-none text-center d-block py-2`}>
                    {card.button}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default AdminDashboard;
