package com.minimart.model;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
public class OrderItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Product product;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Order order;

    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal subTotal;

    public OrderItem() {}

    public OrderItem(Product product, Order order, Integer quantity, BigDecimal unitPrice, BigDecimal subTotal) {
        this.product = product; this.order = order; this.quantity = quantity;
        this.unitPrice = unitPrice; this.subTotal = subTotal;
    }

    public Long getId() { return id; }
    public Product getProduct() { return product; } public void setProduct(Product product) { this.product = product; }
    public Order getOrder() { return order; } public void setOrder(Order order) { this.order = order; }
    public Integer getQuantity() { return quantity; } public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public BigDecimal getUnitPrice() { return unitPrice; } public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
    public BigDecimal getSubTotal() { return subTotal; } public void setSubTotal(BigDecimal subTotal) { this.subTotal = subTotal; }
}
