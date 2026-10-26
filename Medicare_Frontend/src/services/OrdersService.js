import api from "./api";

class OrderService {

    // Matches: GET http://localhost:8087/medicare/order/getAllOrders
    getAllOrders() {
        return api.get("/order/getAllOrders");
    }

    // Matches: GET http://localhost:8087/medicare/order/user/{userId}
    getOrdersByUserId(userId) {
        return api.get(`/order/user/${userId}`);
    }

    // Matches: POST http://localhost:8087/medicare/order/placeorder
    createOrder(userid, totalamount) {
        return api.post(
            "/order/placeorder",
            {
                totalamount,
                status: "PROCESSING",
                paymentstatus: "PAID",
                createdAt: new Date()
                    .toISOString()
                    .slice(0, 19),
                user: {
                    id: userid
                }
            }
        );
    }

    cancelOrder(orderId) {
        return api.delete(
            `/order/cancelOrder/${orderId}`
        );
    }
}

const orderServiceInstance = new OrderService();
export default orderServiceInstance;
