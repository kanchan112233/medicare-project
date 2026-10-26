// src/Pages/Payment.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PaymentService from '../services/PaymentService';

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { totalAmount, userId, checkoutType, appointmentId } = location.state || { 
    totalAmount: 0.00, 
    userId: null, 
    checkoutType: 'cart', 
    appointmentId: null 
  };
  
  const [paymentMode, setPaymentMode] = useState('UPI'); 
  const [processing, setProcessing] = useState(false);

  if (!userId) {
    navigate('/login');
    return null;
  }

  const handleSuccessRedirect = () => {
    if (checkoutType === 'appointment') {
      alert("🎉 Booking Confirmed! Your doctor consultation appointment is scheduled.");
      navigate('/view-appointments'); 
    } else if (checkoutType === 'labtest') {
      alert("🎉 Lab Test Booked! Your diagnostic checkup registration is successful.");
      navigate('/view-lab-bookings'); 
    } else {
      alert("🎉 Payment Successful! Your prescription order has been placed.");
      navigate('/medicine'); 
    }
  };

  const handlePaymentCheckout = (e) => {
    e.preventDefault();
    if (Number(totalAmount) <= 0) {
      alert("Invalid checkout configuration. Your bill amount must be greater than ₹0.");
      return;
    }

    setProcessing(true);

 
    if (checkoutType === 'appointment' || checkoutType === 'labtest') {
      if (!appointmentId) {
        alert("Structural Error: Reference Token is missing.");
        setProcessing(false);
        return;
      }

      const dispatchServerPayment = (mode) => {
        if (checkoutType === 'labtest') {
          return PaymentService.processLabTestPayment(appointmentId, totalAmount, mode);
        } else {
          return PaymentService.processAppointmentPayment(appointmentId, totalAmount, mode);
        }
      };

      if (paymentMode === 'CASH') {
        dispatchServerPayment('CASH')
          .then(() => {
            setProcessing(false);
            handleSuccessRedirect();
          })
          .catch((err) => {
            console.error(err);
            alert("Could not complete booking checkout on server.");
            setProcessing(false);
          });
      } else {
        PaymentService.createOrder(userId, totalAmount)
          .then((res) => {
            const orderData = res.data;
            const checkoutOptions = {
              key: orderData.keyId,
              amount: orderData.amount,
              currency: orderData.currency,
              name: "Medicare Application",
              description: checkoutType === 'labtest' ? "Diagnostic Lab Test Fee" : "Doctor Consultation Fee",
              order_id: orderData.orderId,
              handler: function () {
                dispatchServerPayment(paymentMode)
                  .then(() => {
                    setProcessing(false);
                    handleSuccessRedirect();
                  });
              },
              prefill: { email: "patient.medicare@email.com", contact: "9876543210" },
              modal: { ondismiss: () => setProcessing(false) }
            };
            const rzp = new window.Razorpay(checkoutOptions);
            rzp.open();
          })
          .catch((err) => {
            console.error(err);
            alert("Could not establish transaction reference connection headers.");
            setProcessing(false);
          });
      }
      return;
    }


    if (paymentMode === 'CASH') {
      PaymentService.verifyPayment(userId, "COD-MOCK-ORDER-" + Date.now(), "COD-MOCK-PAYMENT-" + Date.now(), "CASH")
      .then((res) => {
        if (res.data === "SUCCESS") {
          setProcessing(false);
          handleSuccessRedirect();
        } else {
          alert("Order validation failed on backend: " + res.data);
          setProcessing(false);
        }
      });
      return;
    }

    PaymentService.createOrder(userId, totalAmount)
      .then((res) => {
        const orderData = res.data;
        const checkoutOptions = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "Medicare Application",
          description: "Secure Medical Prescription Checkout",
          order_id: orderData.orderId,
          handler: function (rzpRes) {
            PaymentService.verifyPayment(userId, rzpRes.razorpay_order_id, rzpRes.razorpay_payment_id, rzpRes.razorpay_signature)
            .then(() => {
              setProcessing(false);
              handleSuccessRedirect();
            })
            .catch(() => {
              alert("Verification process encountered an issue.");
              setProcessing(false);
            });
          },
          modal: { ondismiss: () => setProcessing(false) }
        };
        const rzp = new window.Razorpay(checkoutOptions);
        rzp.open();
      });
  };

  return (
    <div className="container py-5" style={{ minHeight: '80vh', maxWidth: '1200px' }}>
      <div className="mb-5 text-center text-md-start px-2">
        <h2 className="fw-black text-gray-900 display-5 mb-2">Secure Payment Gateway</h2>
        <p className="text-secondary fs-4">Select your payment method and execute checkout securely</p>
      </div>

      <div className="row g-5">
        <div className="col-md-7">
          <div className="card p-4 shadow-sm border rounded-4 bg-white">
            <h4 className="fw-bold mb-4">Choose Payment Method</h4>
            <form onSubmit={handlePaymentCheckout}>
              <div className="d-flex flex-column gap-3 mb-4">
                <label className={`p-3 border rounded-3 d-flex align-items-center gap-3 cursor-pointer ${paymentMode === 'UPI' ? 'border-primary bg-light fw-bold' : ''}`}>
                  <input type="radio" name="paymode" value="UPI" checked={paymentMode === 'UPI'} onChange={(e) => setPaymentMode(e.target.value)} className="form-check-input" />
                  <span>BHIM / UPI (Google Pay, PhonePe)</span>
                </label>
                <label className={`p-3 border rounded-3 d-flex align-items-center gap-3 cursor-pointer ${paymentMode === 'CARD' ? 'border-primary bg-light fw-bold' : ''}`}>
                  <input type="radio" name="paymode" value="CARD" checked={paymentMode === 'CARD'} onChange={(e) => setPaymentMode(e.target.value)} className="form-check-input" />
                  <span>Credit / Debit Card</span>
                </label>
                <label className={`p-3 border rounded-3 d-flex align-items-center gap-3 cursor-pointer ${paymentMode === 'CASH' ? 'border-primary bg-light fw-bold' : ''}`}>
                  <input type="radio" name="paymode" value="CASH" checked={paymentMode === 'CASH'} onChange={(e) => setPaymentMode(e.target.value)} className="form-check-input" />
                  <span>{checkoutType === 'cart' ? "Cash on Delivery (COD)" : "Pay at Counter / Clinic (Cash)"}</span>
                </label>
              </div>
              <button type="submit" disabled={processing} className="btn btn-primary btn-lg w-100 fw-bold">
                {processing ? "Processing Transaction..." : `Confirm & Pay ₹${totalAmount}`}
              </button>
            </form>
          </div>
        </div>

        <div className="col-md-5">
          <div className="card p-4 shadow-sm border rounded-4 bg-light">
            <h4 className="fw-bold mb-3">Checkout Breakdown</h4>
            <hr />
            <div className="d-flex justify-content-between mb-2">
              <span>Payment Category:</span>
              <span className="fw-bold text-uppercase text-primary">
                {checkoutType === 'labtest' ? 'Lab Diagnosis Checkup' : checkoutType === 'appointment' ? 'Doctor Appointment' : 'Pharmacy Store'}
              </span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Selected Channel:</span>
              <span className="fw-bold text-uppercase">
                {paymentMode === 'CASH' ? (checkoutType === 'cart' ? 'Cash On Delivery' : 'Pay At Clinic') : paymentMode}
              </span>
            </div>
            <hr />
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="fw-bold">Total Net Payable:</span>
              <span className="text-success fw-black fs-3">₹{totalAmount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
