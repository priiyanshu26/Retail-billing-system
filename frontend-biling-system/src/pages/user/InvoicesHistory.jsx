import React, { useEffect, useState } from "react";
import { getAllBillings } from "../../services/billingService";
import { Link, useNavigate } from "react-router-dom";
import "../../components/styles/InvoicesHistory.css";

const InvoicesHistory = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [apiAvailable, setApiAvailable] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("🔄 Fetching invoices from API...");
      
      const data = await getAllBillings();
      console.log("📄 Invoices fetched successfully:", data);
      
      if (Array.isArray(data) && data.length > 0) {
        setInvoices(data);
        setApiAvailable(true);
      } else {
        console.log("⚠️ No invoices returned from API");
        setInvoices([]);
        setApiAvailable(false);
      }
    } catch (err) {
      console.error("❌ Failed to fetch invoices from API:", err.message);
      console.log("ℹ️ The backend API endpoint might not be ready yet");
      setError("Invoices API is not yet available. Please check back soon!");
      setInvoices([]);
      setApiAvailable(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      // Order details are now included in the invoice data from backend
      // No need to fetch separately
    } catch (err) {
      console.error("Failed to fetch order details:", err);
    }
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const handleDownloadInvoice = (invoice) => {
    // Convert invoice to HTML for download
    const htmlContent = generateInvoiceHTML(invoice, null);
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Invoice-${invoice.id || invoice.orderId}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handlePrintInvoice = (invoice) => {
    window.print();
  };

  const generateInvoiceHTML = (invoice, order) => {
    const subtotal = invoice.subtotal || 0;
    const tax = invoice.tax || 0;
    const discount = invoice.discount || 0;
    const total = invoice.totalAmount || subtotal + tax - discount;
    const customerName = invoice.username || order?.customerName || "Customer";

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .invoice { max-width: 800px; margin: 0 auto; padding: 30px; border: 1px solid #ddd; }
          .header { display: flex; justify-content: space-between; margin-bottom: 30px; border-bottom: 2px solid #007bff; padding-bottom: 20px; }
          .title { font-size: 28px; font-weight: bold; color: #007bff; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th { background-color: #007bff; color: white; padding: 12px; text-align: left; }
          td { padding: 12px; border-bottom: 1px solid #ddd; }
          .total-section { text-align: right; margin-top: 20px; }
          .footer { margin-top: 40px; text-align: center; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="invoice">
          <div class="header">
            <div class="title">INVOICE</div>
            <div>
              <div>Invoice #${invoice.id}</div>
              <div>Date: ${new Date().toLocaleDateString()}</div>
            </div>
          </div>
          <div style="margin-bottom: 30px;">
            <h3>Bill To</h3>
            <p><strong>${customerName}</strong></p>
            <p>Order ID: #${invoice.orderId || invoice.id}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${Array.isArray(invoice.items) && invoice.items.length > 0
                ? invoice.items.map(item => `
                  <tr>
                    <td>${item.description || "Item"}</td>
                    <td style="text-align: right;">₹${(item.amount || 0).toFixed(2)}</td>
                  </tr>
                `).join("")
                : '<tr><td colspan="2">No items available</td></tr>'}
            </tbody>
          </table>
          <div class="total-section">
            <div>Subtotal: ₹${subtotal.toFixed(2)}</div>
            <div>Tax: ₹${tax.toFixed(2)}</div>
            ${discount > 0 ? `<div>Discount: -₹${discount.toFixed(2)}</div>` : ''}
            <div style="font-size: 18px; font-weight: bold; color: #007bff; margin-top: 10px;">
              Total: ₹${total.toFixed(2)}
            </div>
          </div>
          <div class="footer">
            <p>Thank you for your purchase!</p>
            <p>This is an electronically generated invoice.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  return (
    <div className="invoices-container">
      <div className="invoices-header">
        <h1>📋 Invoices & Bills</h1>
        <Link to="/billing" className="btn-new-order">
          + New Order
        </Link>
      </div>

      {error && (
        <div className="error-message">
          <p>ℹ️ {error}</p>
          <p style={{ fontSize: "14px", marginTop: "10px", color: "#666" }}>
            The backend API for fetching invoices is still being set up. 
            <br />
            Your invoices will be available once the backend is fully configured.
          </p>
        </div>
      )}

      {loading ? (
        <div className="loading">
          <p>Loading your invoices...</p>
        </div>
      ) : invoices.length === 0 ? (
        <div className="no-invoices">
          <p>📭 No invoices found</p>
          <p style={{ color: "#666", marginTop: "10px" }}>
            Create your first bill to see it here.
          </p>
          <Link to="/billing" className="btn-get-started">
            Get Started
          </Link>
        </div>
      ) : (
        <div className="invoices-list">
          <table className="invoices-table">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Order ID</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="invoice-id">
                    <strong>#{invoice.id}</strong>
                  </td>
                  <td>{invoice.username || "N/A"}</td>
                  <td>#{invoice.orderId}</td>
                  <td>
                    {new Date().toLocaleDateString()}
                  </td>
                  <td className="amount">
                    <strong>₹{invoice.totalAmount?.toFixed(2) || "0.00"}</strong>
                  </td>
                  <td>
                    <span className={`status-badge status-${invoice.status?.toLowerCase() || "generated"}`}>
                      {invoice.status || "Generated"}
                    </span>
                  </td>
                  <td className="actions">
                    <button
                      className="btn-small btn-view"
                      onClick={() => handleViewInvoice(invoice)}
                      title="View Invoice"
                    >
                      👁️ View
                    </button>
                    <button
                      className="btn-small btn-download"
                      onClick={() => handleDownloadInvoice(invoice)}
                      title="Download Invoice"
                    >
                      📥 Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Invoice Modal */}
      {selectedInvoice && (
        <div className="modal-overlay" onClick={() => setSelectedInvoice(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedInvoice(null)}>
              ✕
            </button>

            <div className="modal-invoice">
              <div className="invoice-header-modal">
                <h2 style={{ margin: 0, color: "#007bff" }}>INVOICE</h2>
                <div>
                  <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
                    Invoice #{selectedInvoice.id}
                  </p>
                  <p style={{ margin: "5px 0 0 0", fontSize: "14px", color: "#999" }}>
                    Date: {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", margin: "20px 0" }}>
                <div>
                  <h3 style={{ marginTop: 0, fontSize: "14px", textTransform: "uppercase", color: "#666" }}>
                    Bill To
                  </h3>
                  <p style={{ fontSize: "16px", fontWeight: "bold", margin: 0 }}>
                    {selectedInvoice.username || "N/A"}
                  </p>
                  <p style={{ fontSize: "14px", color: "#666", margin: "5px 0 0 0" }}>
                    Order ID: #{selectedInvoice.orderId}
                  </p>
                </div>
                <div>
                  <h3 style={{ marginTop: 0, fontSize: "14px", textTransform: "uppercase", color: "#666" }}>
                    Company Info
                  </h3>
                  <p style={{ fontSize: "16px", fontWeight: "bold", margin: 0 }}>
                    Billing System
                  </p>
                </div>
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#007bff", color: "white" }}>
                    <th style={{ padding: "12px", textAlign: "left", fontSize: "14px" }}>Description</th>
                    <th style={{ padding: "12px", textAlign: "right", fontSize: "14px" }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(selectedInvoice.items) && selectedInvoice.items.length > 0 ? (
                    selectedInvoice.items.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid #ddd" }}>
                        <td style={{ padding: "12px", fontSize: "14px" }}>
                          {item.description || "Item"}
                        </td>
                        <td style={{ padding: "12px", fontSize: "14px", textAlign: "right" }}>
                          ₹{(item.amount || 0).toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" style={{ padding: "12px", textAlign: "center", color: "#999" }}>
                        No items available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div style={{ textAlign: "right", borderTop: "2px solid #ddd", paddingTop: "15px" }}>
                <div style={{ marginBottom: "10px", fontSize: "14px" }}>
                  Subtotal: <span style={{ marginLeft: "100px" }}>₹{selectedInvoice.subtotal?.toFixed(2) || "0.00"}</span>
                </div>
                <div style={{ marginBottom: "10px", fontSize: "14px" }}>
                  Tax: <span style={{ marginLeft: "100px" }}>₹{selectedInvoice.tax?.toFixed(2) || "0.00"}</span>
                </div>
                {selectedInvoice.discount > 0 && (
                  <div style={{ marginBottom: "10px", fontSize: "14px" }}>
                    Discount: <span style={{ marginLeft: "100px" }}>-₹{selectedInvoice.discount?.toFixed(2) || "0.00"}</span>
                  </div>
                )}
                <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #ddd", fontSize: "18px", fontWeight: "bold", color: "#007bff" }}>
                  Total Amount: <span style={{ marginLeft: "100px" }}>₹{selectedInvoice.totalAmount?.toFixed(2) || "0.00"}</span>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  className="btn btn-download"
                  onClick={() => handleDownloadInvoice(selectedInvoice)}
                >
                  📥 Download PD
                </button>
                <button
                  className="btn btn-print"
                  onClick={() => handlePrintInvoice(selectedInvoice)}
                >
                  🖨️ Print
                </button>
                <button
                  className="btn btn-close"
                  onClick={() => setSelectedInvoice(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicesHistory;
