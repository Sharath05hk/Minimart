package com.minimart.web;

import com.minimart.dto.CreateOrderRequest;
import com.minimart.model.Order;
import com.minimart.service.OrderService;
import com.minimart.service.PdfService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orders;
    private final PdfService pdf;

    public OrderController(OrderService orders, PdfService pdf) { this.orders = orders; this.pdf = pdf; }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','CASHIER')")
    @PostMapping
    public Order create(@Valid @RequestBody CreateOrderRequest req) {
        return orders.create(req);
    }

    @GetMapping("/{id}")
    public Order get(@PathVariable Long id) { return orders.get(id); }

    @GetMapping("/{id}/invoice.pdf")
    public ResponseEntity<byte[]> invoice(@PathVariable Long id) {
        Order o = orders.get(id);
        byte[] bytes = pdf.orderInvoice(o);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=invoice-" + id + ".pdf")
                .body(bytes);
    }
}
