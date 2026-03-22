import { useParams } from "react-router-dom";

const OrderDetails = () => {
  const { orderId } = useParams();

  return (
    <div style={{ padding: "20px" }}>
      <h1>Order Details</h1>
      <p>Order ID: {orderId}</p>

      <p>
        🔹 Items list  
        🔹 Total amount  
        🔹 Payment status
      </p>
    </div>
  );
};

export default OrderDetails;
