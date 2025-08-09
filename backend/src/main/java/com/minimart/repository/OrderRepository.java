package com.minimart.repository;

import com.minimart.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("select o from Order o where o.createdAt between ?1 and ?2")
    List<Order> findAllBetween(Instant from, Instant to);
}
