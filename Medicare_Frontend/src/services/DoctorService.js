import api from './api'; // 

class DoctorService {
  // Matches @GetMapping("/getAlldoctors")
  getAllDoctors() {
    return api.get('/doctor/getAlldoctors'); // relative path matching baseURL
  }

  // Matches @PostMapping("/savedoctor")
  saveDoctor(doctorData) {
    return api.post('/doctor/savedoctor', doctorData);
  }

  // Matches @PutMapping("/updateDoctor/{id}")
  updateDoctor(id, doctorData) {
    return api.put(`/doctor/updateDoctor/${id}`, doctorData);
  }

  // Matches @DeleteMapping("/deleteDoctor/{id}")
  deleteDoctor(id) {
    return api.delete(`/doctor/deleteDoctor/${id}`);
  }

  // Matches @GetMapping("/gerDoctorById/{id}")
  getDoctorById(id) {
    return api.get(`/doctor/gerDoctorById/${id}`);
  }

  // Matches @GetMapping("/getDoctorBySpec/{spec}")
  getDoctorsBySpecialty(specialty) {
    return api.get(`/doctor/getDoctorBySpec/${specialty}`);
  }
}

const doctorServiceInstance = new DoctorService();
export default doctorServiceInstance;
