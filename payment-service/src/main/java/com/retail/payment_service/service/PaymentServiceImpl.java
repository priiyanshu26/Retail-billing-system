//package com.retail.payment_service.service;
//
//import com.retail.payment_service.client.OrderClient;
//import com.retail.payment_service.dto.request.CreatePaymentRequest;
//import com.retail.payment_service.dto.request.VerifyPaymentRequest;
//import com.retail.payment_service.dto.response.PaymentResponse;
//import com.retail.payment_service.entity.Payment;
//import com.retail.payment_service.enums.PaymentStatus;
//import com.retail.payment_service.exception.PaymentException;
//import com.retail.payment_service.repository.PaymentRepository;
//import com.razorpay.RazorpayClient;
//import com.razorpay.Order;
//import org.json.JSONObject;
//import org.springframework.stereotype.Service;
//
//@Service
//public class PaymentServiceImpl implements PaymentService {
//
//    private final PaymentRepository paymentRepository;
//    private final RazorpayClient razorpayClient;
//    private final OrderClient orderClient;
//
//    public PaymentServiceImpl(
//            PaymentRepository paymentRepository,
//            RazorpayClient razorpayClient,
//            OrderClient orderClient) {
//        this.paymentRepository = paymentRepository;
//        this.razorpayClient = razorpayClient;
//        this.orderClient = orderClient;
//    }
//
//    @Override
//    public PaymentResponse createPayment(CreatePaymentRequest request) {
//        try {
//            JSONObject orderRequest = new JSONObject();
//            orderRequest.put("amount", request.getAmount() * 100);
//            orderRequest.put("currency", "INR");
//
//            Order razorpayOrder = razorpayClient.orders.create(orderRequest);
//
//            Payment payment = new Payment();
//            payment.setOrderId(request.getOrderId());
//            payment.setAmount(request.getAmount());
//            payment.setRazorpayOrderId(razorpayOrder.get("id"));
//            payment.setStatus(PaymentStatus.PAYMENT_PENDING);
//
//            paymentRepository.save(payment);
//
//            return new PaymentResponse(
//                    payment.getOrderId(),
//                    payment.getRazorpayOrderId(),
//                    payment.getAmount(),
//                    payment.getStatus()
//            );
//
//        } catch (Exception e) {
//            throw new PaymentException("Failed to create payment");
//        }
//    }
//
////    @Override
////    public PaymentResponse verifyPayment(VerifyPaymentRequest request) {
////
////        Payment payment = paymentRepository
////                .findByRazorpayOrderId(request.getRazorpayOrderId())
////                .orElseThrow(() -> new PaymentException("Payment not found"));
////
////        // TEST MODE: assume success after verification call
////        payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
////        payment.setStatus(PaymentStatus.PAID);
////        paymentRepository.save(payment);
////
////        // Update Order Service
////        orderClient.updateOrderStatus(payment.getOrderId(), "PAID");
////
////        return new PaymentResponse(
////                payment.getOrderId(),
////                payment.getRazorpayOrderId(),
////                payment.getAmount(),
////                payment.getStatus()
////        );
////    }
//    @Override
//    public PaymentResponse verifyPayment(VerifyPaymentRequest request) {
//
//        Payment payment = paymentRepository
//                .findByRazorpayOrderId(request.getRazorpayOrderId())
//                .orElseThrow(() -> new PaymentException("Payment not found"));
//
//        payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
//        payment.setStatus(PaymentStatus.PAID);
//        paymentRepository.save(payment);
//
//        // 🔐 DO NOT FAIL PAYMENT IF ORDER SERVICE FAILS
//        try {
//            orderClient.updateOrderStatus(payment.getOrderId(), "PAID");
//        } catch (Exception ex) {
//            // Log only
//            System.err.println(
//                    "Order service update failed for orderId "
//                            + payment.getOrderId()
//                            + " : " + ex.getMessage()
//            );
//        }
//
//        return new PaymentResponse(
//                payment.getOrderId(),
//                payment.getRazorpayOrderId(),
//                payment.getAmount(),
//                payment.getStatus().name()
//        );
//    }
//
//}

package com.retail.payment_service.service;

import com.retail.payment_service.client.OrderClient;
import com.retail.payment_service.dto.request.CreatePaymentRequest;
import com.retail.payment_service.dto.request.VerifyPaymentRequest;
import com.retail.payment_service.dto.response.PaymentResponse;
import com.retail.payment_service.entity.Payment;
import com.retail.payment_service.enums.PaymentStatus;
import com.retail.payment_service.exception.PaymentException;
import com.retail.payment_service.repository.PaymentRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.Order;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final RazorpayClient razorpayClient;
    private final OrderClient orderClient;

    public PaymentServiceImpl(
            PaymentRepository paymentRepository,
            RazorpayClient razorpayClient,
            OrderClient orderClient) {
        this.paymentRepository = paymentRepository;
        this.razorpayClient = razorpayClient;
        this.orderClient = orderClient;
    }

    // ================= CREATE PAYMENT =================
    @Override
    public PaymentResponse createPayment(CreatePaymentRequest request) {
        try {
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", request.getAmount() * 100); // paise
            orderRequest.put("currency", "INR");

            Order razorpayOrder = razorpayClient.orders.create(orderRequest);

            Payment payment = new Payment();
            payment.setOrderId(request.getOrderId());
            payment.setAmount(request.getAmount());
            payment.setRazorpayOrderId(razorpayOrder.get("id"));
            payment.setStatus(PaymentStatus.PAYMENT_PENDING);

            paymentRepository.save(payment);

            // ✅ ENUM → STRING for DTO
            return new PaymentResponse(
                    payment.getOrderId(),
                    payment.getRazorpayOrderId(),
                    payment.getAmount(),
                    payment.getStatus().name()
            );

        } catch (Exception e) {
            throw new PaymentException("Failed to create payment");
        }
    }

    // ================= VERIFY PAYMENT =================
    @Override
    public PaymentResponse verifyPayment(VerifyPaymentRequest request) {

        Payment payment = paymentRepository
                .findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> new PaymentException("Payment not found"));

        // TEST MODE: assume payment success
        payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
        payment.setStatus(PaymentStatus.PAID);
        paymentRepository.save(payment);

        // 🔐 Do not fail payment if Order Service fails
        try {
            orderClient.updateOrderStatus(payment.getOrderId(), "PAID");
        } catch (Exception ex) {
            System.err.println(
                    "Order service update failed for orderId "
                            + payment.getOrderId()
                            + " : " + ex.getMessage()
            );
        }

        // ✅ ENUM → STRING for DTO
        return new PaymentResponse(
                payment.getOrderId(),
                payment.getRazorpayOrderId(),
                payment.getAmount(),
                payment.getStatus().name()
        );
    }
}

