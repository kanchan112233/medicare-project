package com.itvedant.dr215.MedicareApp.service;

import com.itvedant.dr215.MedicareApp.entity.Patient;
import com.itvedant.dr215.MedicareApp.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PatientService
{
    @Autowired
    private PatientRepository patientRepository;

    public List<Patient> getAllPatients()
    {
        return patientRepository.findAll();
    }

    public Patient getPatientByID(Long id){
        return patientRepository.findById(id).get();
    }

    public Patient savePatient(Patient patient){

        return patientRepository.save(patient);
    }

    public Patient updatePatient(Patient patient ,Long id){
        Optional<Patient> optPat = patientRepository.findById(id);
        if(optPat.isEmpty()){
            return null;
        }
        Patient existingPat = optPat.get();
        if(patient.getFirstname()!=null){
            existingPat.setFirstname(patient.getFirstname());
        }
        if(patient.getLastname()!=null){
            existingPat.setLastname(patient.getLastname());
        }
        if(patient.getGender()!=null){
            existingPat.setGender(patient.getGender());
        }
        if(patient.getBirthdate()!=null)
        {
            existingPat.setBirthdate(patient.getBirthdate());
        }
        if(patient.getPhone()!=null){
            existingPat.setPhone(patient.getPhone());
        }
        if(patient.getEmail()!=null){
            existingPat.setPhone(patient.getPhone());
        }
        if(patient.getAddress()!=null){
            existingPat.setAddress(patient.getAddress());
        }
        if(patient.getBloodgroup()!=null){
            existingPat.setBloodgroup(patient.getBloodgroup());
        }
        if(patient.getRegistrationdate()!=null){
            existingPat.setRegistrationdate(patient.getRegistrationdate());
        }

    return patient;
    }

    public boolean deletePatient(Long id)
    {
        patientRepository.deleteById(id);
        return true;
    }

    public List<Patient> getPatientsByBloodGroup(String bloodgroup){
        return patientRepository.findByBloodgroup(bloodgroup);

}
}
