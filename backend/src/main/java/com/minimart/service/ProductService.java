package com.minimart.service;

import com.minimart.model.Product;
import com.minimart.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {
    private final ProductRepository repo;
    public ProductService(ProductRepository repo) { this.repo = repo; }

    public Product create(Product p) { return repo.save(p); }
    public Product update(Long id, Product p) {
        Product e = repo.findById(id).orElseThrow();
        e.setName(p.getName());
        e.setSku(p.getSku());
        e.setPrice(p.getPrice());
        e.setStock(p.getStock());
        e.setCategory(p.getCategory());
        e.setSupplier(p.getSupplier());
        return repo.save(e);
    }
    public void delete(Long id) { repo.deleteById(id); }
    public Product get(Long id) { return repo.findById(id).orElseThrow(); }
    public List<Product> all() { return repo.findAll(); }
}
