import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOrderById } from "../../services/orderService";
import Invoice from "../../components/user/Invoice";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const paymentData = location.state?.paymentData;
  const orderId = location.state?.orderId || paymentData?.orderId;

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        console.log("❌ No orderId provided in location state");
        setError("No order information available");
        setLoading(false);
        return;
      }

      console.log("🔄 Fetching order for orderId:", orderId);

      try {
        setLoading(true);
        const orderData = await getOrderById(orderId);
        console.log("✅ Order fetched successfully:", orderData);
        setOrder(orderData);
      } catch (err) {
        console.error("❌ Failed to fetch order:", err);
        setError("Failed to load order details, but your payment is confirmed");
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn("⚠️ Order fetch took too long, showing error");
        setLoading(false);
        setError("Invoice loading took too long. Your order details will be available soon.");
      }
    }, 10000); // 10 second timeout

    fetchOrder();

    return () => clearTimeout(timeoutId);
  }, [orderId, loading]);

  if (loading) {
    return (
      <div style={{ padding: "20px", backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{
            backgroundColor: "#d4edda",
            color: "#155724",
            padding: "15px",
            borderRadius: "4px",
            marginBottom: "20px",
            textAlign: "center",
            fontSize: "18px",
            fontWeight: "bold",
            border: "1px solid #c3e6cb"
          }}>
            ✅ Payment Successful!
          </div>
          <div style={{
            backgroundColor: "white",
            padding: "40px",
            textAlign: "center",
            borderRadius: "8px",
            marginBottom: "30px"
          }}>
            <p>Loading your invoice...</p>
          </div>
          {/* Show buttons even while loading */}
          <div style={{
            marginTop: "30px",
            display: "flex",
            gap: "10px",
            justifyContent: "center",
            flexWrap: "wrap"
          }}>
            <Link
              to="/invoices"
              style={{
                padding: "10px 20px",
                backgroundColor: "#28a745",
                color: "white",
                textDecoration: "none",
                borderRadius: "4px",
                fontWeight: "500"
              }}
            >
              View All Invoices
            </Link>
            <Link
              to="/orders"
              style={{
                padding: "10px 20px",
                backgroundColor: "#17a2b8",
                color: "white",
                textDecoration: "none",
                borderRadius: "4px",
                fontWeight: "500"
              }}
            >
              View Order History
            </Link>
            <Link
              to="/billing"
              style={{
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "white",
                textDecoration: "none",
                borderRadius: "4px",
                fontWeight: "500"
              }}
            >
              New Order
            </Link>
            <Link
              to="/profile"
              style={{
                padding: "10px 20px",
                backgroundColor: "#6c757d",
                color: "white",
                textDecoration: "none",
                borderRadius: "4px",
                fontWeight: "500"
              }}
            >
              Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Success Message */}
        <div style={{
          backgroundColor: "#d4edda",
          color: "#155724",
          padding: "15px",
          borderRadius: "4px",
          marginBottom: "20px",
          textAlign: "center",
          fontSize: "18px",
          fontWeight: "bold",
          border: "1px solid #c3e6cb"
        }}>
          ✅ Payment Successful!
        </div>

        {error && (
          <div style={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "15px",
            borderRadius: "4px",
            marginBottom: "20px",
            textAlign: "center",
            border: "1px solid #f5c6cb"
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Invoice Component - Only show if order loaded successfully */}
        {order && (
          <>
            <div style={{ marginBottom: "30px" }}>
              Your invoice is ready below.
            </div>
            <Invoice order={order} paymentDetails={paymentData} />
          </>
        )}

        {/* Navigation Links */}
        <div style={{
          marginTop: "30px",
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          flexWrap: "wrap"
        }}>
          <Link
            to="/invoices"
            style={{
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
              fontWeight: "500"
            }}
          >
            View All Invoices
          </Link>
          <Link
            to="/orders"
            style={{
              padding: "10px 20px",
              backgroundColor: "#17a2b8",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
              fontWeight: "500"
            }}
          >
            View Order History
          </Link>
          <Link
            to="/billing"
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
              fontWeight: "500"
            }}
          >
            New Order
          </Link>
          <Link
            to="/profile"
            style={{
              padding: "10px 20px",
              backgroundColor: "#6c757d",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
              fontWeight: "500"
            }}
          >
            Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
