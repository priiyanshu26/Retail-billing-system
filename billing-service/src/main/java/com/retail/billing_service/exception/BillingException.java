package com.retail.billing_service.exception;

import org.springframework.http.HttpStatus;

public class BillingException extends RuntimeException {

    private final HttpStatus status;

    public BillingException(String message) {
        super(message);
        this.status = HttpStatus.BAD_REQUEST;
    }

    public BillingException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
