package com.minimart.dto;

import jakarta.validation.constraints.NotNull;

import java.util.List;

public class CreateOrderRequest {
    @NotNull
    private Long customerId;
    @NotNull
    private List<Item> items;

    public static class Item {
        private Long productId;
        private Integer quantity;

        public Long getProductId() { return productId; } public void setProductId(Long productId) { this.productId = productId; }
        public Integer getQuantity() { return quantity; } public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }

    public Long getCustomerId() { return customerId; } public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public List<Item> getItems() { return items; } public void setItems(List<Item> items) { this.items = items; }
}
