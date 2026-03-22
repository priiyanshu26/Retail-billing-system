import React, { useState, useEffect } from "react";
import { createPayment, verifyPayment } from "../../services/paymentService";
import { generateBilling } from "../../services/billingService";
import "../styles/PaymentModal.css";

const PaymentModal = ({ orderId, amount, onClose, onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [step, setStep] = useState("initiate"); // initiate, processing, success, failure

  // Initialize Razorpay payment
  useEffect(() => {
    if (window.Razorpay === undefined && step === "initiate") {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.head.appendChild(script);
    }
  }, [step]);

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      // Step 1: Create payment order on backend
      const response = await createPayment({
        orderId,
        amount,
      });

      setPaymentData(response);
      setStep("processing");

      // Step 2: Open Razorpay checkout
      const options = {
        key: "rzp_test_S0AGBk2HEG45dA", // Replace with your Razorpay key
        amount: Math.round(amount * 100), // Amount in paise
        currency: "INR",
        order_id: response.razorpayOrderId,
        name: "Billing System",
        description: `Order #${orderId}`,
        image: "/logo.png", // Your logo
        handler: handlePaymentSuccess,
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        notes: {
          orderId: orderId,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", handlePaymentFailure);
      rzp.open();
    } catch (err) {
      setError(err.message || "Failed to initiate payment");
      setStep("failure");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (response) => {
    try {
      setLoading(true);

      // Step 3: Verify payment on backend
      const verifyResponse = await verifyPayment({
        razorpayOrderId: paymentData.razorpayOrderId,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature,
      });

      // Step 4: Generate billing
      await generateBilling(orderId);

      setStep("success");

      if (onPaymentSuccess) {
        onPaymentSuccess({
          orderId,
          paymentId: response.razorpay_payment_id,
          status: verifyResponse.status,
        });
      }

      // Auto close after 3 seconds
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      setError(err.message || "Payment verification failed");
      setStep("failure");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentFailure = (error) => {
    setError(`Payment failed: ${error.description}`);
    setStep("failure");
  };

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="modal-content">
          {step === "initiate" && (
            <>
              <h2>Complete Payment</h2>
              <div className="payment-details">
                <div className="detail-row">
                  <span>Order ID:</span>
                  <span className="detail-value">#{orderId}</span>
                </div>
                <div className="detail-row">
                  <span>Amount:</span>
                  <span className="detail-value amount">₹{amount.toFixed(2)}</span>
                </div>
                <div className="detail-row">
                  <span>Payment Method:</span>
                  <span className="detail-value">Razorpay (UPI, Cards, Wallets)</span>
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}

              <button
                className="pay-button"
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? "Processing..." : "Pay Now"}
              </button>

              <p className="payment-disclaimer">
                Secure payment powered by Razorpay
              </p>
            </>
          )}

          {step === "processing" && (
            <div className="processing-state">
              <div className="spinner"></div>
              <h3>Processing Payment...</h3>
              <p>Please complete the payment in the Razorpay window</p>
            </div>
          )}

          {step === "success" && (
            <div className="success-state">
              <div className="success-icon">✓</div>
              <h2>Payment Successful!</h2>
              <p>Your order has been placed successfully.</p>
              <div className="payment-details">
                <div className="detail-row">
                  <span>Order ID:</span>
                  <span className="detail-value">#{orderId}</span>
                </div>
                <div className="detail-row">
                  <span>Amount Paid:</span>
                  <span className="detail-value">₹{amount.toFixed(2)}</span>
                </div>
              </div>
              <p className="success-note">Closing in a moment...</p>
            </div>
          )}

          {step === "failure" && (
            <div className="failure-state">
              <div className="failure-icon">✕</div>
              <h2>Payment Failed</h2>
              {error && <p className="error-details">{error}</p>}
              <button className="retry-button" onClick={handlePayment}>
                Try Again
              </button>
              <button className="cancel-button" onClick={onClose}>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
