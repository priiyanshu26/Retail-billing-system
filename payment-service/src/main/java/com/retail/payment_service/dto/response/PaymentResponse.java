package com.retail.payment_service.dto.response;

import com.retail.payment_service.enums.PaymentStatus;

public class PaymentResponse {

    private Long orderId;
    private String razorpayOrderId;
    private Double amount;
    private String  status;

    // Constructors
    public PaymentResponse() {}

    public PaymentResponse(Long orderId, String razorpayOrderId, Double amount, String  status) {
        this.orderId = orderId;
        this.razorpayOrderId = razorpayOrderId;
        this.amount = amount;
        this.status = status;
    }

	public Long getOrderId() {
		return orderId;
	}

	public void setOrderId(Long orderId) {
		this.orderId = orderId;
	}

	public String getRazorpayOrderId() {
		return razorpayOrderId;
	}

	public void setRazorpayOrderId(String razorpayOrderId) {
		this.razorpayOrderId = razorpayOrderId;
	}

	public Double getAmount() {
		return amount;
	}

	public void setAmount(Double amount) {
		this.amount = amount;
	}

	public String  getStatus() {
		return status;
	}

	public void setStatus(String  status) {
		this.status = status;
	}

    // Getters & Setters
}
