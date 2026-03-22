import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import "./AdminDashboard.css";
import { getAllOrders } from "../../services/orderService";
import { getAllProducts } from "../../services/productService";
import { getAllUsers } from "../../services/userService";
import { getAllAdminInvoices } from "../../services/invoiceService";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    totalInvoices: 0,
    pendingOrders: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [ordersData, productsData, usersData, invoicesData] = await Promise.all([
        getAllOrders(),
        getAllProducts(),
        getAllUsers(),
        getAllAdminInvoices()
      ]);

      // Calculate stats
      const totalOrders = Array.isArray(ordersData) ? ordersData.length : 0;
      const pendingOrders = Array.isArray(ordersData) 
        ? ordersData.filter(order => order.status?.toLowerCase() === "pending").length 
        : 0;
      const totalRevenue = Array.isArray(ordersData)
        ? ordersData.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
        : 0;

      // Set recent orders (last 5)
      const recent = Array.isArray(ordersData) ? ordersData.slice(-5).reverse() : [];
      setRecentOrders(recent);

      setStats({
        totalProducts: Array.isArray(productsData) ? productsData.length : 0,
        totalOrders: totalOrders,
        totalUsers: Array.isArray(usersData) ? usersData.length : 0,
        totalRevenue: totalRevenue,
        totalInvoices: Array.isArray(invoicesData) ? invoicesData.length : 0,
        pendingOrders: pendingOrders
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    const statusLower = status?.toLowerCase() || "";
    switch (statusLower) {
      case "completed":
        return "status-completed";
      case "pending":
        return "status-pending";
      case "processing":
        return "status-processing";
      case "generated":
        return "status-completed";
      default:
        return "";
    }
  };

  const formatStatus = (status) => {
    return status?.charAt(0).toUpperCase() + status?.slice(1).toLowerCase() || "Unknown";
  };

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h1>Admin Dashboard</h1>
          <p>Welcome back! Here's your business overview.</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card card-primary">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <h3>Total Products</h3>
              <p className="stat-number">{stats.totalProducts.toLocaleString()}</p>
            </div>
          </div>

          <div className="stat-card card-success">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>Total Orders</h3>
              <p className="stat-number">{stats.totalOrders.toLocaleString()}</p>
            </div>
          </div>

          <div className="stat-card card-info">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>Total Users</h3>
              <p className="stat-number">{stats.totalUsers.toLocaleString()}</p>
            </div>
          </div>

          <div className="stat-card card-warning">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>Total Revenue</h3>
              <p className="stat-number">{stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>

          <div className="stat-card card-danger">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>Pending Orders</h3>
              <p className="stat-number">{stats.pendingOrders}</p>
            </div>
          </div>

          <div className="stat-card card-secondary">
            <div className="stat-icon">🧾</div>
            <div className="stat-content">
              <h3>Total Invoices</h3>
              <p className="stat-number">{stats.totalInvoices.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="recent-orders-section">
          <div className="section-header">
            <h2>Recent Orders</h2>
          </div>
          
          {error && <div className="alert alert-error">{error}</div>}
          
          {loading ? (
            <div className="loading-message">Loading dashboard data...</div>
          ) : recentOrders.length === 0 ? (
            <div className="empty-message">No orders found</div>
          ) : (
            <div className="table-container">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="order-id">
                        <strong>{order.id}</strong>
                      </td>
                      <td>{order.username || order.customer || "N/A"}</td>
                      <td className="amount">{(order.totalAmount || 0).toFixed(2)}</td>
                      <td>
                        <span className={`status-badge ${getStatusClass(order.status)}`}>
                          {formatStatus(order.status)}
                        </span>
                      </td>
                      <td>{new Date(order.createdAt || new Date()).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
