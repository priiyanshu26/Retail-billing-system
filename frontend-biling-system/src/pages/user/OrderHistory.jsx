import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const OrderHistory = () => {
  const { username } = useAuth();

  return (
    <div style={{ padding: "20px" }}>
      <h1>Order History</h1>
      <p>Customer: {username}</p>

      <ul>
        {/* Later this will be dynamic */}
        <li>
          Order #1 – <Link to="/orders/1">View Details</Link>
        </li>
      </ul>
    </div>
  );
};

export default OrderHistory;
