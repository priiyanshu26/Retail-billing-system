import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getAllAdminInvoices } from "../../services/invoiceService";
import "./AdminInvoices.css";

const AdminInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllAdminInvoices();
      setInvoices(Array.isArray(data) ? data : []);
      setCurrentPage(1); // Reset to first page on fetch
    } catch (err) {
      console.error("Error fetching invoices:", err);
      setError(err.message || "Failed to fetch invoices");
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const getTotalRevenue = () => {
    return invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0).toFixed(2);
  };

  // Pagination calculations
  const totalPages = Math.ceil(invoices.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const paginatedInvoices = invoices.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (pageNum) => {
    setCurrentPage(pageNum);
  };

  return (
    <AdminLayout>
      <div className="management-container">
        {/* Header */}
        <div className="management-header">
          <h1>🧾 Invoice Management</h1>
        </div>

        {/* Stats Cards */}
        <div className="stats-row">
          <div className="stat-small">
            <span className="stat-label">Total Invoices</span>
            <span className="stat-value">{invoices.length}</span>
          </div>
          <div className="stat-small">
            <span className="stat-label">Total Revenue</span>
            <span className="stat-value">{getTotalRevenue()}</span>
          </div>
          <div className="stat-small">
            <span className="stat-label">Avg Invoice</span>
            <span className="stat-value">
              {invoices.length > 0 ? (getTotalRevenue() / invoices.length).toFixed(2) : "0.00"}
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {error && <div className="alert alert-error">{error}</div>}

        {/* Refresh Button */}
        <div className="action-bar">
          <button onClick={fetchInvoices} className="btn btn-primary" disabled={loading}>
            {loading ? "Refreshing..." : "🔄 Refresh"}
          </button>
        </div>

        {/* Invoices List */}
        <div className="list-card">
          <div className="list-header">
            <h2>All Invoices</h2>
            {loading && <span className="loading-spinner">Loading...</span>}
          </div>

          {invoices.length === 0 ? (
            <div className="empty-state">
              <p>📄 No invoices found.</p>
            </div>
          ) : (
            <>
              <div className="invoices-table">
                <table>
                  <thead>
                    <tr>
                      <th>Invoice ID</th>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Tax</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedInvoices.map((invoice) => (
                      <tr key={invoice.id}>
                        <td className="invoice-id">{invoice.id}</td>
                        <td>{invoice.orderId || "N/A"}</td>
                        <td>{invoice.username || "N/A"}</td>
                        <td className="price">{(invoice.totalAmount || 0).toFixed(2)}</td>
                        <td>{(invoice.tax || 0).toFixed(2)}</td>
                        <td>
                          <span className={`status-badge status-${(invoice.status || "paid").toLowerCase()}`}>
                            {invoice.status || "PAID"}
                          </span>
                        </td>
                        <td>{new Date(invoice.createdAt || new Date()).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="pagination-controls">
                <button 
                  className="pagination-btn"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  ← Previous
                </button>

                <div className="pagination-numbers">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index + 1}
                      className={`page-number ${currentPage === index + 1 ? "active" : ""}`}
                      onClick={() => handlePageClick(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button 
                  className="pagination-btn"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next →
                </button>

                <span className="pagination-info">
                  Page {currentPage} of {totalPages} | Showing {paginatedInvoices.length} of {invoices.length} records
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminInvoices;
