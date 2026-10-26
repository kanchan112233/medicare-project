package com.itvedant.dr215.MedicareApp.service;

import com.itvedant.dr215.MedicareApp.entity.LabBooking;
import com.itvedant.dr215.MedicareApp.entity.LabTest;
import com.itvedant.dr215.MedicareApp.entity.User;
import com.itvedant.dr215.MedicareApp.repository.LabBookingRepository;
import com.itvedant.dr215.MedicareApp.repository.LabTestRepository;
import com.itvedant.dr215.MedicareApp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class LabBookingService {

    @Autowired
    private LabBookingRepository labBookingRepository;

    @Autowired
    private LabTestRepository labTestRepository;

    @Autowired
    private UserRepository userRepository;

    public LabBooking addBooking(LabBooking booking) {
        if (booking == null || booking.getLabTest() == null || booking.getLabTest().getId() == null) {
            throw new RuntimeException("Lab Test ID is required");
        }
        if (booking.getUser() == null || booking.getUser().getId() == null) {
            throw new RuntimeException("User session configuration context missing");
        }

        LabTest test = labTestRepository.findById(booking.getLabTest().getId())
                .orElseThrow(() -> new RuntimeException("Lab Test row entry not found"));
        User user = userRepository.findById(booking.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User account row entry not found"));

        booking.setLabTest(test);
        booking.setUser(user);
        booking.setBillamount(test.getPrice());

        booking.setAppointmentDate(booking.getAppointmentDate());

        booking.setStatus("Pending");
        booking.setPaymentstatus("Unpaid");

        return labBookingRepository.save(booking);
    }

    @Transactional
    public LabBooking processPayment(Long id, Double payment, String paymode) {
        LabBooking booking = labBookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lab Booking not found"));

        booking.setBillamount(payment);
        booking.setPaymentmode(paymode);
        booking.setStatus("Booked");

        if ("CASH".equalsIgnoreCase(paymode)) {
            booking.setPaymentstatus("Unpaid");
        } else {
            booking.setPaymentstatus("Paid");
        }

        return labBookingRepository.save(booking);
    }

    @Transactional
    public LabBooking updateBookingDate(Long id, String date) {
        LabBooking booking = labBookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lab Booking Entry Not Found with ID: " + id));
        booking.setAppointmentDate(date);
        return labBookingRepository.save(booking);
    }

    public List<LabBooking> getBookingsByUserId(Long userId) {
        return labBookingRepository.findByUser_Id(userId);
    }
}
