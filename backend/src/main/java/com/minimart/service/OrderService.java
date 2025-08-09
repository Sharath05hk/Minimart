package com.minimart.service;

import com.minimart.dto.CreateOrderRequest;
import com.minimart.model.*;
import com.minimart.repository.CustomerRepository;
import com.minimart.repository.OrderRepository;
import com.minimart.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class OrderService {
    private final OrderRepository orderRepo;
    private final CustomerRepository customerRepo;
    private final ProductRepository productRepo;

    public OrderService(OrderRepository orderRepo, CustomerRepository customerRepo, ProductRepository productRepo) {
        this.orderRepo = orderRepo; this.customerRepo = customerRepo; this.productRepo = productRepo;
    }

    @Transactional
    public Order create(CreateOrderRequest req) {
        Customer customer = customerRepo.findById(req.getCustomerId()).orElseThrow();
        Order order = new Order(customer);
        BigDecimal total = BigDecimal.ZERO;

        for (CreateOrderRequest.Item i : req.getItems()) {
            Product p = productRepo.findById(i.getProductId()).orElseThrow();
            if (p.getStock() < i.getQuantity()) throw new RuntimeException("Insufficient stock for " + p.getName());
            BigDecimal unit = p.getPrice();
            BigDecimal sub = unit.multiply(BigDecimal.valueOf(i.getQuantity()));
            OrderItem oi = new OrderItem(p, order, i.getQuantity(), unit, sub);
            order.getItems().add(oi);
            p.setStock(p.getStock() - i.getQuantity());
            productRepo.save(p);
            total = total.add(sub);
        }
        order.setTotalAmount(total);
        order.setStatus(OrderStatus.PAID);
        return orderRepo.save(order);
    }

    public Order get(Long id) { return orderRepo.findById(id).orElseThrow(); }
}
