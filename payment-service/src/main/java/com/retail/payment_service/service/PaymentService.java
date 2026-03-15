package com.retail.payment_service.service;

import com.retail.payment_service.dto.request.CreatePaymentRequest;
import com.retail.payment_service.dto.request.VerifyPaymentRequest;
import com.retail.payment_service.dto.response.PaymentResponse;

public interface PaymentService {

    PaymentResponse createPayment(CreatePaymentRequest request);

    PaymentResponse verifyPayment(VerifyPaymentRequest request);
}
