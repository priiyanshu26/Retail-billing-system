//package com.retail.billing_service.service;
//
//import com.retail.billing_service.client.OrderClient;
//import com.retail.billing_service.dto.request.GenerateInvoiceRequestDto;
//import com.retail.billing_service.dto.response.InvoiceItemResponseDto;
//import com.retail.billing_service.dto.response.InvoiceResponseDto;
//import com.retail.billing_service.entity.Invoice;
//import com.retail.billing_service.entity.InvoiceItem;
//import com.retail.billing_service.repository.InvoiceRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDateTime;
//import java.util.List;
//
//@Service
//@RequiredArgsConstructor
//public class BillingServiceImpl implements BillingService {
//
//    private final InvoiceRepository repository;
//    private final OrderClient orderClient;
//
//    @Override
//    public InvoiceResponseDto generateInvoice(GenerateInvoiceRequestDto request) {
//
//        // ✅ 1. Call Order Service
//        var response = orderClient.getOrderById(request.getOrderId());
//
//        // ✅ 2. Validate response
//        if (response == null || !response.isSuccess() || response.getData() == null) {
//            throw new RuntimeException("Order not found or invalid response from Order Service");
//        }
//
//        // ✅ 3. Extract actual order
//        var order = response.getData();
//
//        // ✅ 4. Business calculations
//        double subtotal = order.getTotalAmount();
//        double tax = subtotal * 0.18;
//        double discount = subtotal * 0.05;
//        double total = subtotal + tax - discount;
//
//        // ✅ 5. Save Invoice
//        Invoice invoice = Invoice.builder()
//                .orderId(order.getId())
//                .username(order.getUsername())
//                .subtotal(subtotal)
//                .tax(tax)
//                .discount(discount)
//                .totalAmount(total)
//                .status("GENERATED")
//                .createdAt(LocalDateTime.now())
//                .build();
//
//        repository.save(invoice);
//
//        // ✅ 6. Build response
//        return InvoiceResponseDto.builder()
//                .id(invoice.getId())
//                .orderId(invoice.getOrderId())
//                .username(invoice.getUsername())
//                .subtotal(subtotal)
//                .tax(tax)
//                .discount(discount)
//                .totalAmount(total)
//                .status(invoice.getStatus())
//                .items(List.of(
//                        InvoiceItemResponseDto.builder()
//                                .description("Order Total")
//                                .amount(subtotal)
//                                .build()
//                ))
//                .build();
//    }
//}

package com.retail.billing_service.service;

import com.retail.billing_service.client.OrderClient;
import com.retail.billing_service.dto.request.GenerateInvoiceRequestDto;
import com.retail.billing_service.dto.response.InvoiceItemResponseDto;
import com.retail.billing_service.dto.response.InvoiceResponseDto;
import com.retail.billing_service.entity.Invoice;
import com.retail.billing_service.entity.InvoiceItem;
import com.retail.billing_service.exception.ResourceNotFoundException;
import com.retail.billing_service.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BillingServiceImpl implements BillingService {

    private final InvoiceRepository invoiceRepository;
    private final OrderClient orderClient;

    @Override
    @Transactional
    public InvoiceResponseDto generateInvoice(GenerateInvoiceRequestDto request) {

        // 1️⃣ Fetch Order from Order Service
        var order = orderClient.getOrderById(request.getOrderId()).getData();

        if (order == null) {
            throw new ResourceNotFoundException("Order not found");
        }

        // 2️⃣ Calculate values
        double subtotal = order.getTotalAmount();
        double tax = subtotal * 0.18;       // 18% tax
        double discount = subtotal * 0.05;  // 5% discount
        double totalAmount = subtotal + tax - discount;

        // 3️⃣ Create Invoice
        Invoice invoice = Invoice.builder()
                .orderId(order.getId())
                .username(order.getUsername())
                .subtotal(subtotal)
                .tax(tax)
                .discount(discount)
                .totalAmount(totalAmount)
                .status("GENERATED")
                .createdAt(LocalDateTime.now())
                .build();

        // 4️⃣ Create Invoice Items
        InvoiceItem orderItem = InvoiceItem.builder()
                .description("Order Total")
                .amount(subtotal)
                .invoice(invoice)
                .build();

        InvoiceItem taxItem = InvoiceItem.builder()
                .description("Tax (18%)")
                .amount(tax)
                .invoice(invoice)
                .build();

        InvoiceItem discountItem = InvoiceItem.builder()
                .description("Discount")
                .amount(-discount)
                .invoice(invoice)
                .build();

        // 5️⃣ Attach items to invoice
        invoice.setItems(List.of(orderItem, taxItem, discountItem));

        // 6️⃣ Save invoice (cascade saves items)
        Invoice savedInvoice = invoiceRepository.save(invoice);

        // 7️⃣ Build Response DTO
        return InvoiceResponseDto.builder()
                .id(savedInvoice.getId())
                .orderId(savedInvoice.getOrderId())
                .username(savedInvoice.getUsername())
                .subtotal(savedInvoice.getSubtotal())
                .tax(savedInvoice.getTax())
                .discount(savedInvoice.getDiscount())
                .totalAmount(savedInvoice.getTotalAmount())
                .status(savedInvoice.getStatus())
                .items(savedInvoice.getItems().stream()
                        .map(i -> InvoiceItemResponseDto.builder()
                                .description(i.getDescription())
                                .amount(i.getAmount())
                                .build())
                        .toList())
                .build();
    }

	@Override
	@Transactional(readOnly = true)
	public List<InvoiceResponseDto> getAllInvoices() {
		 List<Invoice> invoices = invoiceRepository.findAll();

		    return invoices.stream()
		            .map(invoice -> InvoiceResponseDto.builder()
		                    .id(invoice.getId())
		                    .orderId(invoice.getOrderId())
		                    .username(invoice.getUsername())
		                    .subtotal(invoice.getSubtotal())
		                    .tax(invoice.getTax())
		                    .discount(invoice.getDiscount())
		                    .totalAmount(invoice.getTotalAmount())
		                    .status(invoice.getStatus())
		                    .items(invoice.getItems().stream()
		                            .map(item -> InvoiceItemResponseDto.builder()
		                                    .description(item.getDescription())
		                                    .amount(item.getAmount())
		                                    .build())
		                            .toList())
		                    .build())
		            .toList();
	}
   
}
