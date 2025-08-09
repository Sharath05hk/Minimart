package com.minimart.web;

import com.minimart.model.Product;
import com.minimart.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService service;
    public ProductController(ProductService service) { this.service = service; }

    @GetMapping public List<Product> all() { return service.all(); }
    @GetMapping("/{id}") public Product get(@PathVariable Long id) { return service.get(id); }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @PostMapping public Product create(@Valid @RequestBody Product p) { return service.create(p); }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @PutMapping("/{id}") public Product update(@PathVariable Long id, @Valid @RequestBody Product p) { return service.update(id, p); }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @DeleteMapping("/{id}") public void delete(@PathVariable Long id) { service.delete(id); }
}
