package com.retail.payment_service.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class CreatePaymentRequest {

    @NotNull
    private Long orderId;

    @NotNull
    @Positive
    private Double amount;

	public Long getOrderId() {
		return orderId;
	}

	public void setOrderId(Long orderId) {
		this.orderId = orderId;
	}

	public Double getAmount() {
		return amount;
	}

	public void setAmount(Double amount) {
		this.amount = amount;
	}

    // Getters & Setters
}
