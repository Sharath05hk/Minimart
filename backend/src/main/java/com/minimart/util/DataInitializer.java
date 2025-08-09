package com.minimart.util;

import com.minimart.model.*;
import com.minimart.repository.CustomerRepository;
import com.minimart.repository.ProductRepository;
import com.minimart.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.Set;

@Configuration
public class DataInitializer implements CommandLineRunner {
    private final UserRepository users;
    private final ProductRepository products;
    private final CustomerRepository customers;
    private final PasswordEncoder encoder;

    public DataInitializer(UserRepository users, ProductRepository products, CustomerRepository customers, PasswordEncoder encoder) {
        this.users = users; this.products = products; this.customers = customers; this.encoder = encoder;
    }

    @Override
    public void run(String... args) {
        if (users.count() == 0) {
            User admin = new User("admin@minimart.local", encoder.encode("Admin@123"), "Admin", Set.of(Role.ADMIN, Role.MANAGER));
            users.save(admin);
            User cashier = new User("cashier@minimart.local", encoder.encode("Cashier@123"), "Cashier", Set.of(Role.CASHIER));
            users.save(cashier);
        }

        if (products.count() == 0) {
            products.save(new Product("Apple", "SKU-APPLE", new BigDecimal("0.50"), 100, "Fruits", "Local Farm"));
            products.save(new Product("Milk 1L", "SKU-MILK1L", new BigDecimal("1.20"), 50, "Dairy", "Dairy Co"));
            products.save(new Product("Bread", "SKU-BREAD", new BigDecimal("1.00"), 80, "Bakery", "Bakers Inc."));
        }

        if (customers.count() == 0) {
            customers.save(new Customer("Alice", "alice@example.com", "1234567890"));
            customers.save(new Customer("Bob", "bob@example.com", "9876543210"));
        }
    }
}
