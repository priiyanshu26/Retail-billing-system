import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getUserById } from "../../services/userService";

import ProductList from "../../components/user/ProductList";
import Cart from "../../components/user/Cart";
import BillSummary from "../../components/user/BillSummary";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Toast from "../../components/common/Toast";

import { createOrder, addItemToOrder } from "../../services/orderService";
import { generateBilling } from "../../services/billingService";
import "./BillingScreen.css";

const BillingScreen = () => {
  const { username, userId, logout } = useAuth(); // cashier
  const navigate = useNavigate();

  // 🔹 Customer (buyer)
  const [customerName, setCustomerName] = useState("");

  // 🔹 Cart
  const [cartItems, setCartItems] = useState([]);

  // 🔹 Order (CREATED state)
  const [order, setOrder] = useState(null);

  // 🔹 UI state
  const [showBill, setShowBill] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Profile modal state
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // 🔹 Logout confirmation state
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  // 🔹 Toast notification state
  const [toast, setToast] = useState(null);

  // Handle Profile click
  const handleProfileClick = async () => {
    try {
      setLoadingProfile(true);
      const details = await getUserById(userId);
      setUserDetails(details);
      setShowProfileModal(true);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile details");
    } finally {
      setLoadingProfile(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setLogoutConfirm(false);
    logout();
    navigate("/login");
  };

  // Add product to cart
  const handleAddToCart = (product) => {
    setError("");

    setCartItems((prev) => {
      const existing = prev.find((p) => p.id === product.id);

      if (existing) {
        return prev.map((p) =>
          p.id === product.id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // Checkout → Create Order
  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError("");

      if (!customerName.trim()) {
        setError("Customer name is required");
        return;
      }

      if (cartItems.length === 0) {
        setError("Cart is empty");
        return;
      }

      // ✅ Create order with CUSTOMER NAME
      const createdOrder = await createOrder(customerName);

      // Add items to order
      for (const item of cartItems) {
        await addItemToOrder(createdOrder.id, {
          productId: item.id,
          quantity: item.quantity,
        });
      }

      // Prepare order for BillSummary UI
      setOrder({
        ...createdOrder,
        customerName,
        items: cartItems,
      });

      setShowBill(true); // 👉 show BillSummary (NO billing fetch)
    } catch (err) {
      console.error(err);
      setError("Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  // Generate Bill
  const handleGenerateBill = async () => {
    try {
      setLoading(true);
      await generateBilling(order.id); // 🔥 ACTUAL BILL CREATION
      setToast({ message: "Bill generated successfully!", type: "success", duration: 3000 });
    } catch (err) {
      console.error(err);
      setToast({ message: "Failed to generate bill", type: "error", duration: 4000 });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="billing-wrapper">
      {/* Modern Header */}
      <div className="billing-header">
        <div className="header-left">
          <h1>Billing Screen</h1>
          <p className="header-subtitle">Point of Sale System</p>
        </div>
        <div className="header-right">
          <div className="cashier-info">
            <div className="cashier-badge">
              <span className="cashier-label">Cashier</span>
              <span className="cashier-name">{username}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-header logout-btn" title="Logout">
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Main Content */}
      {!showBill ? (
        <div className="billing-container">
          {/* Customer Details Section */}
          <div className="customer-section">
            <div className="customer-card">
              <h2>👤 Customer Details</h2>
              <input
                type="text"
                placeholder="Enter customer name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="customer-input"
                disabled={loading}
              />
            </div>
          </div>

          <div className="billing-main">
            {/* Products Section */}
            <div className="products-section">
              <ProductList onAddToCart={handleAddToCart} />
            </div>

            {/* Cart Section */}
            <div className="cart-section">
              <Cart
                items={cartItems}
                onItemsChange={setCartItems}
                onCheckout={handleCheckout}
                loading={loading}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="bill-section">
          <BillSummary
            order={order}
            onGenerateBill={handleGenerateBill}
          />
          <button 
            onClick={() => {
              setShowBill(false);
              setOrder(null);
              setCartItems([]);
              setCustomerName("");
            }}
            className="btn btn-primary"
            style={{ marginTop: "20px" }}
          >
            ↩️ New Order
          </button>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>👤 My Profile</h2>
              <button
                onClick={() => setShowProfileModal(false)}
                className="close-btn"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              {loadingProfile ? (
                <p className="loading-text">Loading profile details...</p>
              ) : userDetails ? (
                <>
                  <div className="detail-row">
                    <label className="detail-label">User ID:</label>
                    <span className="detail-value">{userDetails.id}</span>
                  </div>
                  <div className="detail-row">
                    <label className="detail-label">Username:</label>
                    <span className="detail-value">{userDetails.username}</span>
                  </div>
                  <div className="detail-row">
                    <label className="detail-label">Status:</label>
                    <span className={`status-badge ${userDetails.enabled ? "status-active" : "status-inactive"}`}>
                      {userDetails.enabled ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="detail-row">
                    <label className="detail-label">Roles:</label>
                    <div className="roles-container">
                      {userDetails.roles && userDetails.roles.map((role, idx) => (
                        <span key={idx} className="role-badge">
                          {role.replace("ROLE_", "")}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <p style={{ color: "red" }}>Failed to load profile details</p>
              )}
            </div>
            <div className="modal-footer">
              <button
                onClick={() => setShowProfileModal(false)}
                className="btn btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={logoutConfirm}
        title="Confirm Logout"
        message="Are you sure you want to logout? You will need to login again to access this system."
        onConfirm={confirmLogout}
        onCancel={() => setLogoutConfirm(false)}
        confirmText="Log Out"
        cancelText="Cancel"
        isDangerous={true}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default BillingScreen;
