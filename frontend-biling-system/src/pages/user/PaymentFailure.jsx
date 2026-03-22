import { Link } from "react-router-dom";

const PaymentFailure = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ color: "red" }}>❌ Payment Failed</h1>

      <p>Please try again.</p>

      <Link to="/billing">Retry Billing</Link>
    </div>
  );
};

export default PaymentFailure;
