import api from './api';

class MedicineService {
  getAllMedicines() {
    return api.get('/medicine/getAllmedicines');
  }

  saveMedicine(medicineData) {
    return api.post('/medicine/saveMedicine', medicineData);
  }

  updateMedicine(id, medicineData) {
    return api.put(`/medicine/updateMedicine/${id}`, medicineData);
  }

  deleteMedicine(id) {
    return api.delete(`/medicine/deleteMedicine/${id}`);
  }
}

const medicineServiceInstance = new MedicineService();
export default medicineServiceInstance;
