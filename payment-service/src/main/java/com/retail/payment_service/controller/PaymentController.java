package com.retail.payment_service.controller;

import com.retail.payment_service.dto.request.CreatePaymentRequest;
import com.retail.payment_service.dto.request.VerifyPaymentRequest;
import com.retail.payment_service.dto.response.PaymentResponse;
import com.retail.payment_service.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create")
    public ResponseEntity<PaymentResponse> createPayment(
            @Valid @RequestBody CreatePaymentRequest request) {
        return ResponseEntity.ok(paymentService.createPayment(request));
    }

    @PostMapping("/verify")
    public ResponseEntity<PaymentResponse> verifyPayment(
            @Valid @RequestBody VerifyPaymentRequest request) {
        return ResponseEntity.ok(paymentService.verifyPayment(request));
    }
}
