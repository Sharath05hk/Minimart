package com.minimart.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

@Entity
@Table(name = "products", indexes = @Index(name="idx_sku", columnList = "sku", unique = true))
public class Product extends AuditModel {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank @Column(nullable = false)
    private String name;

    @NotBlank @Column(nullable = false, unique = true)
    private String sku;

    @NotNull @Column(nullable = false, scale = 2, precision = 12)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer stock = 0;

    private String category;
    private String supplier;

    public Product() {}

    public Product(String name, String sku, BigDecimal price, Integer stock, String category, String supplier) {
        this.name = name; this.sku = sku; this.price = price; this.stock = stock;
        this.category = category; this.supplier = supplier;
    }

    public Long getId() { return id; }
    public String getName() { return name; } public void setName(String name) { this.name = name; }
    public String getSku() { return sku; } public void setSku(String sku) { this.sku = sku; }
    public BigDecimal getPrice() { return price; } public void setPrice(BigDecimal price) { this.price = price; }
    public Integer getStock() { return stock; } public void setStock(Integer stock) { this.stock = stock; }
    public String getCategory() { return category; } public void setCategory(String category) { this.category = category; }
    public String getSupplier() { return supplier; } public void setSupplier(String supplier) { this.supplier = supplier; }
}
