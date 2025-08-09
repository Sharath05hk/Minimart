package com.minimart.service;

import com.lowagie.text.Chunk;
import com.lowagie.text.Document;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.minimart.model.Order;
import com.minimart.model.OrderItem;
import com.minimart.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {
    private final OrderRepository orderRepo;

    public ReportService(OrderRepository orderRepo) {
        this.orderRepo = orderRepo;
    }

    public Map<String, Object> salesSummary(Instant from, Instant to) {
        List<Order> orders = orderRepo.findAllBetween(from, to);
        BigDecimal totalRevenue = BigDecimal.ZERO;
        int totalOrders = orders.size();
        Map<String, Integer> productQty = new HashMap<>();

        for (Order o : orders) {
            totalRevenue = totalRevenue.add(o.getTotalAmount());
            for (OrderItem i : o.getItems()) {
                String name = i.getProduct().getName();
                productQty.put(name, productQty.getOrDefault(name, 0) + i.getQuantity());
            }
        }

        String topProduct = productQty.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(null);

        Map<String, Object> res = new HashMap<>();
        res.put("from", from.toString());
        res.put("to", to.toString());
        res.put("totalRevenue", totalRevenue);
        res.put("totalOrders", totalOrders);
        res.put("topProduct", topProduct);
        return res;
    }

    public byte[] salesSummaryPdf(Instant from, Instant to) {
        Map<String, Object> summary = salesSummary(from, to);
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Document doc = new Document();
            PdfWriter.getInstance(doc, baos);
            doc.open();
            doc.add(new Paragraph("Minimart - Sales Report",
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18)));
            doc.add(new Paragraph("From: " + summary.get("from")));
            doc.add(new Paragraph("To: " + summary.get("to")));
            doc.add(Chunk.NEWLINE);

            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(60);
            table.addCell("Total Orders");
            table.addCell(summary.get("totalOrders").toString());
            table.addCell("Total Revenue");
            table.addCell(summary.get("totalRevenue").toString());
            table.addCell("Top Product");
            table.addCell(String.valueOf(summary.get("topProduct")));
            doc.add(table);

            doc.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate sales report PDF", e);
        }
    }
}
