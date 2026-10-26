// src/services/CartService.js
import api from './api'; // Enforces global injection of 'Authorization: Bearer <TOKEN>' headers

class CartService {
  /**
   * Dispatches shopping cart items securely to your database tables
   * @param {number} userId - Logged-in profile key identification string
   * @param {number} medicineId - Target medicine database row ID
   * @param {number} quantity - Item increments count configuration
   */
  addToCart(userId, medicineId, quantity = 1) {
    // FIXED: Pushes payload to matching /cartitem path route relative to base url definition
    return api.post('/cartitem/addtocart', {
      userid: Number(userId),
      medicineid: Number(medicineId),
      quantity: Number(quantity)
    });
  }

  updateQuantity(id, quantity) {
    return api.put(`/cartitem/updatequantity/${id}?quantity=${quantity}`);
  }

  deleteCartItem(id) {
    return api.delete(`/cartitem/deleteItem/${id}`);
  }
}

const cartServiceInstance = new CartService();
export default cartServiceInstance;
