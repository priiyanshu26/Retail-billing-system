import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByCustomer,
  addItemToOrder,
  removeItemFromOrder,
  deleteOrder,
} from "../../services/orderService";
import { getAllProducts } from "../../services/productService";
import { getToken } from "../../utils/tokenUtils";
import { decodeToken, getUserRole, getUsername } from "../../utils/roleUtils";
import "./OrderManagement.css";

const OrderManagement = () => {
  const [activeTab, setActiveTab] = useState("view"); // "view", "create", "search"
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form states
  const [newCustomerName, setNewCustomerName] = useState("");
  const [searchCustomerName, setSearchCustomerName] = useState("");
  const [newItemProductId, setNewItemProductId] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");

  useEffect(() => {
    // Debug authentication
    const token = getToken();
    console.log("🔐 Authentication Check:");
    console.log("  Token exists:", !!token);
    if (token) {
      const decoded = decodeToken(token);
      console.log("  Decoded token:", decoded);
      console.log("  Username:", getUsername(token));
      console.log("  Role:", getUserRole(token));
    }
    
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError("");
      
      let ordersData = [];
      let productsData = [];
      
      try {
        ordersData = await getAllOrders();
        if (Array.isArray(ordersData)) {
          setOrders(ordersData);
          console.log("✅ Orders loaded:", ordersData);
        } else {
          setOrders([]);
          console.warn("⚠️ Orders response is not an array:", ordersData);
        }
      } catch (ordersErr) {
        console.error("❌ Error loading orders:", ordersErr.message);
        setOrders([]);
        setError(`Failed to load orders: ${ordersErr.message}`);
      }

      try {
        productsData = await getAllProducts();
        console.log("🔍 Products from API:", productsData);
        if (Array.isArray(productsData)) {
          setProducts(productsData);
          console.log("✅ Products loaded successfully. Count:", productsData.length);
        } else {
          console.warn("⚠️ Products response is not an array:", productsData);
          setProducts([]);
        }
      } catch (productsErr) {
        console.error("❌ Error loading products:", productsErr.message);
        setProducts([]);
        if (!ordersData || ordersData.length === 0) {
          setError((prev) => prev ? `${prev} | Failed to load products: ${productsErr.message}` : `Failed to load products: ${productsErr.message}`);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!newCustomerName.trim()) {
      setError("Customer name is required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await createOrder(newCustomerName);
      setNewCustomerName("");
      setActiveTab("view");
      loadInitialData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchCustomer = async (e) => {
    e.preventDefault();
    if (!searchCustomerName.trim()) {
      setError("Customer name is required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await getOrdersByCustomer(searchCustomerName);
      setOrders(Array.isArray(data) ? data : []);
      // Switch to view tab to display search results
      setActiveTab("view");
    } catch (err) {
      setError(err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!selectedOrder || !newItemProductId || !newItemQuantity) {
      setError("Please select product and enter quantity");
      return;
    }

    try {
      setLoading(true);
      setError("");
      console.log(`📝 POST http://localhost:8080/api/orders/${selectedOrder.id}/items`, {
        productId: parseInt(newItemProductId),
        quantity: parseInt(newItemQuantity),
      });
      await addItemToOrder(selectedOrder.id, {
        productId: parseInt(newItemProductId),
        quantity: parseInt(newItemQuantity),
      });
      console.log("✅ Item added successfully");
      setNewItemProductId("");
      setNewItemQuantity("");
      const updatedOrder = await getOrderById(selectedOrder.id);
      setSelectedOrder(updatedOrder);
      loadInitialData();
    } catch (err) {
      console.error("❌ Error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!window.confirm("Delete this item from order?")) return;

    try {
      setLoading(true);
      console.log(`🗑️ DELETE http://localhost:8080/api/orders/${selectedOrder.id}/items/${itemId}`);
      await removeItemFromOrder(selectedOrder.id, itemId);
      console.log("✅ Item removed successfully");
      const updatedOrder = await getOrderById(selectedOrder.id);
      setSelectedOrder(updatedOrder);
      loadInitialData();
    } catch (err) {
      console.error("❌ Error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async () => {
    if (!window.confirm("Delete entire order? This cannot be undone!")) return;

    try {
      setLoading(true);
      console.log(`🗑️ DELETE http://localhost:8080/api/orders/${selectedOrder.id}`);
      await deleteOrder(selectedOrder.id);
      console.log("✅ Order deleted successfully");
      setSelectedOrder(null);
      loadInitialData();
    } catch (err) {
      console.error("❌ Error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = async (order) => {
    try {
      setLoading(true);
      console.log(`🔍 GET http://localhost:8080/api/orders/${order.id}`);
      const fullOrder = await getOrderById(order.id);
      console.log("✅ Order fetched:", fullOrder);
      setSelectedOrder(fullOrder);
    } catch (err) {
      console.error("❌ Error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="management-container">
        {/* Header */}
        <div className="management-header">
          <h1>📦 Order Management</h1>
        </div>

        {/* Error Alert */}
        {error && <div className="alert alert-error">{error}</div>}

        {/* Tabs */}
        <div className="tab-header">
          <button
            className={`tab-btn ${activeTab === "view" ? "active" : ""}`}
            onClick={() => { setActiveTab("view"); setSearchCustomerName(""); loadInitialData(); }}
          >
            📋 View All Orders
          </button>
          <button
            className={`tab-btn ${activeTab === "create" ? "active" : ""}`}
            onClick={() => setActiveTab("create")}
          >
            ➕ Create Order
          </button>
          <button
            className={`tab-btn ${activeTab === "search" ? "active" : ""}`}
            onClick={() => setActiveTab("search")}
          >
            🔍 Search Orders
          </button>
        </div>

        {/* CREATE ORDER TAB */}
        {activeTab === "create" && (
          <div className="form-card">
            <h2>Create New Order</h2>
            <form onSubmit={handleCreateOrder} className="management-form">
              <div className="form-group">
                <label>Customer Name *</label>
                <input
                  type="text"
                  placeholder="Enter customer name"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  className="form-input"
                  disabled={loading}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Creating..." : "➕ Create Order"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* SEARCH TAB */}
        {activeTab === "search" && (
          <div className="form-card">
            <h2>Search Orders by Customer</h2>
            <form onSubmit={handleSearchCustomer} className="management-form">
              <div className="form-group">
                <label>Customer Name *</label>
                <input
                  type="text"
                  placeholder="Enter customer name"
                  value={searchCustomerName}
                  onChange={(e) => setSearchCustomerName(e.target.value)}
                  className="form-input"
                  disabled={loading}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Searching..." : "🔍 Search"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* VIEW ALL ORDERS TAB */}
        {activeTab === "view" && (
          <div className="orders-container">
            <div className="orders-list">
              <div className="list-header">
                <h2>Orders ({orders.length})</h2>
                {loading && <span className="loading-spinner">Loading...</span>}
              </div>

              {orders.length === 0 ? (
                <div className="empty-state">
                  <p>📦 No orders found.</p>
                </div>
              ) : (
                <div className="orders-grid">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className={`order-card ${selectedOrder?.id === order.id ? "active" : ""}`}
                      onClick={() => handleViewOrder(order)}
                    >
                      <div className="order-card-header">
                        <h4>Order #{order.id}</h4>
                        <span className={`status-badge status-${(order.status || "pending").toLowerCase()}`}>
                          {order.status || "PENDING"}
                        </span>
                      </div>
                      <div className="order-card-body">
                        <p><strong>Customer:</strong> {order.username || order.customerName || "N/A"}</p>
                        <p><strong>Items:</strong> {order.items?.length || 0}</p>
                        <p className="order-total"><strong>Total:</strong> ${(order.totalAmount || 0).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order Details Panel */}
            {selectedOrder && (
              <div className="details-card">
                <div className="details-header">
                  <h2>Order Details</h2>
                  <button className="close-btn" onClick={() => setSelectedOrder(null)}>✕</button>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Order ID:</span>
                  <span className="detail-value">#{selectedOrder.id}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Customer:</span>
                  <span className="detail-value">{selectedOrder.username || selectedOrder.customerName || "N/A"}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Total Amount:</span>
                  <span className="detail-value price">${(selectedOrder.totalAmount || 0).toFixed(2)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Status:</span>
                  <span className={`status-badge status-${(selectedOrder.status || "pending").toLowerCase()}`}>
                    {selectedOrder.status || "PENDING"}
                  </span>
                </div>
                {selectedOrder.createdAt && (
                  <div className="detail-row">
                    <span className="detail-label">Created:</span>
                    <span className="detail-value">{new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
                  </div>
                )}

                {/* Order Items */}
                {selectedOrder.items && selectedOrder.items.length > 0 && (
                  <div className="items-section">
                    <h3>Order Items ({selectedOrder.items.length})</h3>
                    <div className="items-list">
                      {selectedOrder.items.map((item) => (
                        <div key={item.id} className="item-row">
                          <div className="item-info">
                            <strong>{item.productName || `Product ${item.productId}`}</strong>
                            <p>Qty: {item.quantity} × ${(item.price || 0).toFixed(2)}</p>
                          </div>
                          <div className="item-amount">
                            <strong>${((item.quantity || 0) * (item.price || 0)).toFixed(2)}</strong>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="btn-icon delete-btn"
                            title="Remove"
                            disabled={loading}
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Item Form */}
                {products.length > 0 && (
                  <div className="add-item-section">
                    <h3>Add Item to Order</h3>
                    <form onSubmit={handleAddItem} className="inline-form">
                      <select
                        value={newItemProductId}
                        onChange={(e) => setNewItemProductId(e.target.value)}
                        className="form-input"
                        disabled={loading}
                      >
                        <option value="">Select Product</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} - ${(p.price || 0).toFixed(2)}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min="1"
                        value={newItemQuantity}
                        onChange={(e) => setNewItemQuantity(e.target.value)}
                        placeholder="Qty"
                        className="form-input"
                        disabled={loading}
                      />
                      <button type="submit" className="btn btn-primary" disabled={loading}>
                        ➕ Add
                      </button>
                    </form>
                  </div>
                )}

                {/* Delete Order Button */}
                <div className="modal-actions">
                  <button
                    onClick={handleDeleteOrder}
                    className="btn btn-danger"
                    disabled={loading}
                  >
                    🗑️ Delete Order
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default OrderManagement;
