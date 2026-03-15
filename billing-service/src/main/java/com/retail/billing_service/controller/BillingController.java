package com.retail.billing_service.controller;

import com.retail.billing_service.dto.request.GenerateInvoiceRequestDto;
import com.retail.billing_service.service.BillingService;
import com.retail.billing_service.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/billing")
@RequiredArgsConstructor
public class BillingController {

    private final BillingService service;

    @PostMapping("/generate")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ApiResponse<?> generate(@RequestBody GenerateInvoiceRequestDto request) {
        return ApiResponse.success(service.generateInvoice(request));
    }
    
    @GetMapping("/admin/invoices")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<?> getAllInvoices() {
        return ApiResponse.success(service.getAllInvoices());
    }
}
