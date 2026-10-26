import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderService from "../services/OrdersService";

export default function ViewOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        OrderService.getOrdersByUserId(user.id)
            .then((response) => {
                console.log("Orders Response:", response.data);
                setOrders(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Order Error:", error);
                setLoading(false);
            });
    }, [user, navigate]);

    const getStatusBadgeClass = (status) => {
        switch (status?.toUpperCase()) {
            case "PLACED": return "bg-primary text-white";
            case "DELIVERED": return "bg-success text-white";
            case "CANCELLED": return "bg-danger text-white";
            default: return "bg-warning text-dark";
        }
    };

    const getPaymentBadgeClass = (payStatus) => {
        if (payStatus?.toUpperCase() === "PAID") return "bg-success text-white";
        if (payStatus?.toUpperCase()?.includes("PENDING")) return "bg-warning text-dark";
        return "bg-secondary text-white";
    };

    if (loading) {
        return (
            <div className="container py-5 text-center" style={{ minHeight: '70vh' }}>
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-3 fw-bold text-secondary">Loading Orders...</p>
            </div>
        );
    }

    return (
        <div className="container py-5" style={{ minHeight: '80vh', maxWidth: '1200px' }}>
            <div className="mb-4 text-center text-md-start">
                <h2 className="fw-black text-gray-900 display-6 mb-2">My Pharmacy Orders</h2>
                <p className="text-secondary">View and track your placed medical prescription orders</p>
            </div>

            {orders.length === 0 ? (
                <div className="card p-5 text-center shadow-sm border rounded-4 bg-white">
                    <h4 className="fw-bold mb-2">No Orders Found</h4>
                    <p className="text-muted mb-4">
                        You haven't placed any medical prescription orders yet.
                    </p>
                    <button
                        className="btn btn-primary btn-lg rounded-pill px-4 fw-bold shadow-sm"
                        onClick={() => navigate("/medicine")}
                    >
                        Browse Pharmacy Shop
                    </button>
                </div>
            ) : (
                // 🚀 CARDS GRID START
                <div className="row g-4">
                    {orders.map((order) => (
                        <div className="col-15 col-md-6 col-lg-4" key={order.id}>
                            <div className="card h-100 shadow-sm border-0 rounded-4" style={{ backgroundColor: '#fcf6e8' }}>
                                
                                {/* Card Header */}
                                <div className="card-body p-4 d-flex flex-column justify-content-between">
                                    <div>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h5 className="fw-bold text-dark mb-0">Order #{order.id}</h5>
                                            <span className={`badge px-3 py-2 rounded-pill fw-bold ${getStatusBadgeClass(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <hr className="text-muted opacity-25" />

                                        {/* Order Details Grid */}
                                        <div className="row g-3 my-2">
                                            <div className="col-6">
                                                <small className="text-muted d-block text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>Total Amount</small>
                                                <span className="fs-4 fw-black text-success">₹{order.totalamount}</span>
                                            </div>
                                            <div className="col-6 text-end">
                                                <small className="text-muted d-block text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>Payment Status</small>
                                                <span className={`badge mt-2 px-2 py-1.5 rounded ${getPaymentBadgeClass(order.paymentstatus)}`} style={{ fontSize: '0.8rem' }}>
                                                    {order.paymentstatus?.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Footer (Date) */}
                                    <div className="mt-4 pt-3 border-top border-2 border-white d-flex justify-content-between align-items-center">
                                        <small className="text-secondary fw-medium">
                                            📅 {order.createdAt
                                                ? new Date(order.createdAt).toLocaleDateString()
                                                : "N/A"}
                                        </small>
                                        <small className="text-muted">
                                            🕒 {order.createdAt
                                                ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                : ""}
                                        </small>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                // 🚀 CARDS GRID END
            )}
        </div>
    );
}
