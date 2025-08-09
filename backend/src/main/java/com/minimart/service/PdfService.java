package com.minimart.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.minimart.model.Order;
import com.minimart.model.OrderItem;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.text.NumberFormat;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
public class PdfService {

    public byte[] orderInvoice(Order order) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Document document = new Document();
            PdfWriter.getInstance(document, baos);
            document.open();

            NumberFormat currency = NumberFormat.getCurrencyInstance(Locale.US);
            DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")
                    .withZone(ZoneId.systemDefault());

            document.add(new Paragraph("Minimart - Invoice", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18)));
            document.add(new Paragraph("Order ID: " + order.getId()));
            document.add(new Paragraph("Date: " + fmt.format(order.getCreatedAt())));
            document.add(new Paragraph("Customer: " + order.getCustomer().getName()));
            document.add(Chunk.NEWLINE);

            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            table.setWidths(new int[]{6, 2, 3, 3});
            addHeader(table, "Product", "Qty", "Unit Price", "Subtotal");

            for (OrderItem item : order.getItems()) {
                table.addCell(item.getProduct().getName());
                table.addCell(String.valueOf(item.getQuantity()));
                table.addCell(currency.format(item.getUnitPrice()));
                table.addCell(currency.format(item.getSubTotal()));
            }
            document.add(table);

            document.add(Chunk.NEWLINE);
            document.add(new Paragraph("Total: " + currency.format(order.getTotalAmount()),
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));

            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate invoice PDF", e);
        }
    }

    private void addHeader(PdfPTable table, String... headers) {
        for (String h : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(h, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12)));
            table.addCell(cell);
        }
    }
}
