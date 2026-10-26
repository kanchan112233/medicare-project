package com.itvedant.dr215.MedicareApp.service;

import com.itvedant.dr215.MedicareApp.entity.Appointment;
import com.itvedant.dr215.MedicareApp.entity.Doctor;
import com.itvedant.dr215.MedicareApp.entity.User;
import com.itvedant.dr215.MedicareApp.repository.AppointmentRepository;
import com.itvedant.dr215.MedicareApp.repository.DoctorRepository;
import com.itvedant.dr215.MedicareApp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorRepository doctorRepository;
    public Appointment addAppointment(Appointment appointment) {

        Doctor doctor = doctorRepository
                .findById(appointment.getDoctor().getId())
                .orElseThrow();

        appointment.setDoctor(doctor);

        User user = userRepository
                .findById(appointment.getUser().getId())
                .orElseThrow();

        appointment.setUser(user);

        return appointmentRepository.save(appointment);
    }
    // Renamed for clarity
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Appointment confirmAppointment(Long id) {
        Appointment appointments = appointmentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Appointment Not Booked"));
        appointments.setStatus("Booked");
        return appointments;
    }

    public Appointment processPayment(Long id,Double payamount, String paymode){
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(()->new RuntimeException("Appointment Not Found"));
        appointment.setBillamount(payamount);
        appointment.setPaymentmode(paymode);
        appointment.setStatus("Booked");
        appointment.setPaymentstatus("Paid");
        return appointmentRepository.save(appointment);
    }
    public List<Appointment> getAppointmentsByUserId(
            Long userId) {

        return appointmentRepository
                .findByUser_Id(userId);
    }


}

