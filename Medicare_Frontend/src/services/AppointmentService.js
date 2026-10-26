import api from "./api";

class AppointmentService {

    // Admin - Get all appointments
    getAllAppointments() {
        return api.get(
            "/appointment/getAllAppointments"
        );
    }

    
    // Patient - Get only logged-in user's appointments
    getAppointmentsByUserId(userId) {
        return api.get(
            `/appointment/user/${userId}`
        );
    }

    // Book appointment
    addAppointment(appointment) {
        return api.post(
            "/appointment/addAppointment",
            appointment
        );
    }

    // Confirm appointment
    confirmAppointment(id) {
        return api.put(
            `/appointment/confirm/${id}`
        );
    }

    // Process payment
    processPayment(
        id,
        payamount,
        paymode
    ) {

        return api.put(
            `/appointment/processPayment/${id}`,
            null,
            {
                params: {
                    payamount,
                    paymode
                }
            }
        );
    }
}

export default new AppointmentService();