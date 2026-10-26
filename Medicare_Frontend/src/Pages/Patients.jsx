import React, { useEffect, useState } from "react";
import { getAllPatients } from "../services/PatientServics";

function Patients() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    getAllPatients().then(res => setPatients(res.data));
  }, []);

  return (
    <div className="container my-5">
      <h2 className="text-primary">Patients</h2>
      <div className="row">
        {patients.map(p => (
          <div key={p.id} className="col-md-4 col-sm-6 col-12 mb-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text">Age: {p.age}</p>
                <p className="card-text">Blood Group: {p.bloodGroup}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Patients;
