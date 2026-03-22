import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const UserProfile = () => {
  const { username, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ padding: "30px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>👤 User Profile</h1>

      <div style={{ 
        backgroundColor: "white", 
        padding: "20px", 
        borderRadius: "8px", 
        marginBottom: "20px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <p style={{ fontSize: "16px", marginBottom: "20px" }}>
          <strong>Username:</strong> {username}
        </p>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
          <Link 
            to="/invoices" 
            style={{
              display: "inline-block",
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
              fontWeight: "500"
            }}
          >
            📄 View Invoices
          </Link>
          <Link 
            to="/orders" 
            style={{
              display: "inline-block",
              padding: "10px 20px",
              backgroundColor: "#17a2b8",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
              fontWeight: "500"
            }}
          >
            📋 View Orders
          </Link>
          <Link 
            to="/billing" 
            style={{
              display: "inline-block",
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
              fontWeight: "500"
            }}
          >
            ➕ New Order
          </Link>
        </div>

        <button 
          onClick={handleLogout}
          style={{
            padding: "10px 20px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontWeight: "500",
            cursor: "pointer"
          }}
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
