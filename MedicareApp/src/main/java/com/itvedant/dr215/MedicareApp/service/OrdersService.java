package com.itvedant.dr215.MedicareApp.service;

import com.itvedant.dr215.MedicareApp.entity.Orders;
import com.itvedant.dr215.MedicareApp.repository.OrdersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrdersService {

    @Autowired
    private OrdersRepository ordersRepository;

    public Orders placeOrder(Orders order){
        if(order.getStatus() == null){
            order.setStatus("Placed");
        }
        return ordersRepository.save(order);
    }

    public List<Orders> getALlOrders(){
        return ordersRepository.findAll();
    }

    public List<Orders> getOrdersByUserId(Long userId) {

        return ordersRepository.findByUserId(userId);

    }

    public Boolean cancelOrder(Long id){
        if (ordersRepository.existsById(id)) {
            ordersRepository.deleteById(id);
            return true;
        }
        throw new RuntimeException("Order Record Not Found with ID: " + id);
    }

    public Orders getOrderByID(Long id){
        return ordersRepository.findById(id).orElse(null);
    }
}
