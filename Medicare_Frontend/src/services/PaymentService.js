// src/services/PaymentService.js
import api from './api'; 

class PaymentService {
  

  createOrder(userId, amount) {
    return api.post('/../api/payment/create-order', { 
      userId: Number(userId), 
      amount: Math.round(amount) 
    });
  }

  verifyPayment(userId, razorpayOrderId, razorpayPaymentId, razorpaySignature) {
    return api.post('/../api/payment/verify', {
      userId: Number(userId),
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    });
  }

  processAppointmentPayment(id, paymentAmount, paymentMode) {
    return api.put(`/appointment/processpay/${id}`, null, {
      params: {
        payment: Number(paymentAmount),
        paymode: paymentMode
      }
    });
  }

 
  processLabTestPayment(id, paymentAmount, paymentMode) {
    return api.put(`/lab-booking/processpay/${id}`, null, {
      params: {
        payment: Number(paymentAmount),
        paymode: paymentMode
      }
    });
  }
}

const paymentServiceInstance = new PaymentService();
export default paymentServiceInstance;
