package com.minimart.web;

import com.minimart.service.ReportService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.time.*;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {
    private final ReportService reports;
    public ReportController(ReportService reports) { this.reports = reports; }

    @GetMapping("/sales")
    public Map<String,Object> salesJson(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        return reports.salesSummary(from.atStartOfDay(ZoneId.systemDefault()).toInstant(),
                to.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant());
    }

    @GetMapping("/sales.pdf")
    public ResponseEntity<byte[]> salesPdf(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        byte[] bytes = reports.salesSummaryPdf(from.atStartOfDay(ZoneId.systemDefault()).toInstant(),
                to.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant());
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=sales-report.pdf")
                .body(bytes);
    }
}
