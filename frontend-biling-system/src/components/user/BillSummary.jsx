import React, { useState, useEffect } from "react";
import { createPayment, verifyPayment, getPaymentStatus } from "../../services/paymentService";
import "../styles/BillSummary.css";

// Load Razorpay script
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const BillSummary = ({ order, onGenerateBill }) => {
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");

  // Fetch payment status from backend on mount or when order changes
  useEffect(() => {
    let ignore = false;
    async function fetchStatus() {
      if (!order?.id) return;
      try {
        const statusRes = await getPaymentStatus(order.id);
        if (!ignore) {
          setPaymentStatus(statusRes.status);
          setPaymentDetails(statusRes);
        }
      } catch (err) {
        // Handle error silently
      }
    }
    fetchStatus();
    return () => { ignore = true; };
  }, [order?.id]);

  if (!order || !order.items || order.items.length === 0) {
    return <p>No order selected</p>;
  }

  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    await onGenerateBill();
    setGenerated(true);
    setLoading(false);
  };

  // Razorpay payment flow
  const handleCreatePayment = async () => {
    setLoading(true);
    setError("");
    try {
      const payment = await createPayment({ orderId: order.id, amount: total });
      setPaymentDetails(payment);
      setPaymentStatus(payment.status);

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setError("Failed to load Razorpay SDK");
        setLoading(false);
        return;
      }

      const options = {
        key: "rzp_test_S0AGBk2HEG45dA",
        amount: payment.amount * 100,
        currency: "INR",
        name: "Retail Billing System",
        description: `Order #${order.id}`,
        order_id: payment.razorpayOrderId,
        handler: async function (response) {
          setVerifying(true);
          try {
            const verifyRes = await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            setPaymentStatus(verifyRes.status);
            setPaymentDetails(verifyRes);
            setError("");
            if (verifyRes.status === "PAID") {
              alert("Payment verified: PAID");
            }
          } catch (err) {
            setError("Failed to verify payment: " + err.message);
          } finally {
            setVerifying(false);
          }
        },
        prefill: {
          name: order.customerName,
        },
        theme: { color: "#3399cc" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      let msg = err.message;
      setError("Failed to create payment: " + msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bill-summary-container">
      <h3>Bill Summary</h3>

      <p><strong>Customer:</strong> {order.customerName}</p>
      <p><strong>Order ID:</strong> {order.id}</p>

      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, idx) => (
            <tr key={idx}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>?{item.price}</td>
              <td>?{(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>Total Payable: ?{total.toFixed(2)}</h4>

      <button onClick={handleGenerate} disabled={loading || generated}>
        {loading ? "Generating..." : generated ? "Bill Generated" : "Generate Bill"}
      </button>

      {generated && (
        <>
          <p style={{ color: "green" }}>
            Bill saved successfully in database
          </p>
          <div style={{ marginTop: 20 }}>
            <h4>Payment Gateway</h4>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {!paymentStatus || paymentStatus === "PAYMENT_PENDING" ? (
              <button onClick={handleCreatePayment} disabled={loading || verifying}>
                {loading ? "Processing..." : verifying ? "Verifying..." : paymentDetails ? "Pay Now" : "Initiate Payment"}
              </button>
            ) : null}
            {paymentStatus === "PAID" && (
              <p style={{ color: "blue" }}>Payment Successful</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BillSummary;
