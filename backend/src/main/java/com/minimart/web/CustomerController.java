package com.minimart.web;

import com.minimart.model.Customer;
import com.minimart.repository.CustomerRepository;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {
    private final CustomerRepository repo;
    public CustomerController(CustomerRepository repo) { this.repo = repo; }

    @GetMapping public List<Customer> all() { return repo.findAll(); }
    @GetMapping("/{id}") public Customer get(@PathVariable Long id) { return repo.findById(id).orElseThrow(); }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','CASHIER')")
    @PostMapping public Customer create(@Valid @RequestBody Customer c) { return repo.save(c); }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @PutMapping("/{id}") public Customer update(@PathVariable Long id, @Valid @RequestBody Customer c) {
        Customer e = repo.findById(id).orElseThrow();
        e.setName(c.getName()); e.setEmail(c.getEmail()); e.setPhone(c.getPhone());
        return repo.save(e);
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @DeleteMapping("/{id}") public void delete(@PathVariable Long id) { repo.deleteById(id); }
}
