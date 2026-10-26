import api from './api';

class LabTestService {

  // Matches: GET http://localhost:8087/medicare/labtest/all
  getAllLabTests() {
    return api.get('/labtest/all');
  }

  // Matches: GET http://localhost:8087/medicare/labtest/{id}
  getLabTestById(id) {
    return api.get(`/labtest/${id}`);
  }



  // Maps to: POST http://localhost:8087/medicare/lab-booking/addBooking
  bookLabTest(testId, userId, appointmentDate) {
    return api.post('/lab-booking/addBooking', {
      labTest: { id: Number(testId) },
      user: { id: Number(userId) },
      appointmentDate: appointmentDate,
      billamount: null,
      status: "Pending",
      paymentstatus: "Unpaid"
    });
  }

  // Maps to: GET http://localhost:8087/medicare/lab-booking/user/{userId}
  getLabBookingsByUserId(userId) {
    return api.get(`/lab-booking/user/${userId}`);
  }
}

const labTestServiceInstance = new LabTestService();
export default labTestServiceInstance;
