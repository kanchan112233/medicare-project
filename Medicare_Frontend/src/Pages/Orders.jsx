// src/Pages/Orders.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderService from '../services/OrdersService';

export default function Orders() {
  const navigate = useNavigate();
  const [ordersList, setOrdersList] = useState([]);
  const [loading, setLoading] = useState(true);

  const sessionUser = JSON.parse(localStorage.getItem('user'));
  const currentUserId = sessionUser ? Number(sessionUser.id) : null;

  useEffect(() => {
    if (!currentUserId) {
      navigate('/login');
      return;
    }

    setLoading(true);
    OrderService.getAllOrders()
      .then((response) => {
        let rawOrders = response.data || [];
        
        const userOrders = rawOrders.filter(order => {
          const orderUserId = order.user?.id || order.userid;
          return Number(orderUserId) === Number(currentUserId);
        });

        setOrdersList(userOrders);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setOrdersList([]);
        setLoading(false);
      });
  }, [currentUserId, navigate]);

  return (
    <div className="container py-5" style={{ minHeight: '80vh' }}>
      <div className="mb-5 text-center text-md-start">
        <h2 className="fw-black text-gray-900 display-5 mb-2">My Pharmacy Orders</h2>
        <p className="text-secondary fs-5">Track and view your complete prescription and medicine purchase history</p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status"></div>
          <p className="mt-3 text-muted fw-bold">Loading your pharmacy orders...</p>
        </div>
      ) : ordersList.length === 0 ? (
        <div className="alert bg-light text-center p-5 border rounded-4 shadow-sm">
          <i className="bi bi-bag-x display-3 text-warning d-block mb-3"></i>
          <h4 className="fw-bold text-gray-800 mb-2">No Orders Found</h4>
          <p className="mb-0 text-muted fs-5">You haven't placed any medical prescription orders yet.</p>
          <button
    className="btn btn-primary"
    onClick={() => navigate("/medicine")}
>
    Browse Pharmacy Shop
</button>
        </div>
      ) : (
        <div className="table-responsive shadow-sm rounded-4 border bg-white p-3">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-uppercase fs-6">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3">Date & Time</th>
                <th className="py-3">Total Amount</th>
                <th className="py-3">Delivery Status</th>
                <th className="py-3">Payment Details</th>
              </tr>
            </thead>
            <tbody>
              {ordersList.map((order) => (
                <tr key={order.id}>
                  <td className="py-3 px-4 fw-bold text-primary">#MED-ORD-{order.id}</td>
                  <td>{order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}</td>
                  <td className="fw-bold text-dark fs-5">₹{order.totalamount}</td>
                  <td>
                    <span className={`badge px-3 py-2 rounded-pill small ${
                      order.status?.toLowerCase() === 'placed' ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-warning-subtle text-warning'
                    }`}>
                      {order.status || 'Placed'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge px-3 py-2 rounded-pill small ${
                      order.paymentstatus?.toLowerCase() === 'paid' ? 'bg-info-subtle text-info border border-info-subtle' : 'bg-secondary-subtle text-secondary'
                    }`}>
                      {order.paymentstatus === 'PENDING_COD' ? 'COD - Unpaid' : order.paymentstatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
