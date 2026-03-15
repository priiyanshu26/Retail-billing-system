package com.retail.billing_service.service;

import com.retail.billing_service.dto.request.GenerateInvoiceRequestDto;
import com.retail.billing_service.dto.response.InvoiceResponseDto;
import java.util.List;
public interface BillingService {
    InvoiceResponseDto generateInvoice(GenerateInvoiceRequestDto request);
    
    List<InvoiceResponseDto> getAllInvoices();

	
}
