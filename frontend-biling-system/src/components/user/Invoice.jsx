import React, { useState } from "react";
import { downloadInvoicePDF, triggerInvoiceDownload } from "../../services/invoiceService";
import "../styles/Invoice.css";

const Invoice = ({ order, paymentDetails }) => {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  if (!order) {
    return <div className="invoice-container">No order data available</div>;
  }

  // Calculate totals
  const subtotal = order.items?.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  ) || 0;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + tax;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      setError("");

      // Create invoice HTML content
      const htmlContent = generateInvoiceHTML();
      
      // Create blob and download
      const blob = new Blob([htmlContent], { type: "text/html" });
      triggerInvoiceDownload(blob, `Invoice-${order.id}.html`);
    } catch (err) {
      setError("Failed to download invoice: " + err.message);
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  const generateInvoiceHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f5f5f5;
          }
          .invoice-container {
            background-color: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            max-width: 800px;
            margin: 0 auto;
          }
          .invoice-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            border-bottom: 2px solid #007bff;
            padding-bottom: 20px;
          }
          .invoice-title {
            font-size: 24px;
            font-weight: bold;
            color: #007bff;
          }
          .invoice-number {
            font-size: 18px;
            color: #666;
          }
          .section {
            margin-bottom: 20px;
          }
          .section-title {
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
            font-size: 14px;
            text-transform: uppercase;
          }
          .row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 14px;
          }
          .label {
            color: #666;
          }
          .value {
            font-weight: 500;
            color: #333;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th {
            background-color: #007bff;
            color: white;
            padding: 12px;
            text-align: left;
            font-size: 14px;
          }
          td {
            padding: 12px;
            border-bottom: 1px solid #ddd;
            font-size: 14px;
          }
          tr:hover {
            background-color: #f9f9f9;
          }
          .total-section {
            text-align: right;
            margin-top: 20px;
            border-top: 2px solid #ddd;
            padding-top: 15px;
          }
          .total-row {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 10px;
            font-size: 16px;
          }
          .total-value {
            font-weight: bold;
            color: #007bff;
            font-size: 20px;
            margin-top: 10px;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            color: #999;
            font-size: 12px;
          }
          .payment-status {
            background-color: #d4edda;
            color: #155724;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 20px;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="invoice-header">
            <div>
              <div class="invoice-title">INVOICE</div>
            </div>
            <div>
              <div class="invoice-number">Invoice #${order.id}</div>
              <div class="row" style="margin-bottom: 0;">
                <span class="label">Date:</span>
                <span class="value">${new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div class="payment-status">✓ Payment Successful</div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
            <div class="section">
              <div class="section-title">Bill To</div>
              <div class="row">
                <span class="value">${order.customerName || "N/A"}</span>
              </div>
              <div class="row">
                <span class="label">Order ID: #${order.id}</span>
              </div>
            </div>
            <div class="section">
              <div class="section-title">Company Info</div>
              <div class="row">
                <span class="value">Billing System</span>
              </div>
              <div class="row">
                <span class="label">Support: support@billing.com</span>
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${order.items?.map(item => `
                <tr>
                  <td>${item.productName || item.name || "Product"}</td>
                  <td>${item.quantity}</td>
                  <td>₹${item.price?.toFixed(2) || "0.00"}</td>
                  <td>₹${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>

          <div class="total-section">
            <div class="total-row">
              <span>Subtotal: </span>
              <span style="margin-left: 20px; width: 100px; text-align: right;">₹${subtotal.toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span>Tax (18% GST): </span>
              <span style="margin-left: 20px; width: 100px; text-align: right;">₹${tax.toFixed(2)}</span>
            </div>
            <div class="total-row" style="border-top: 1px solid #ddd; padding-top: 10px; margin-top: 10px;">
              <span>Total Amount: </span>
              <span class="total-value" style="margin-left: 20px; width: 100px; text-align: right;">₹${total.toFixed(2)}</span>
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
    <div className="invoice-wrapper">
      <div className="invoice-actions">
        <button className="btn btn-print" onClick={handlePrint}>
          🖨️ Print Invoice
        </button>
        <button 
          className="btn btn-download" 
          onClick={handleDownload} 
          disabled={downloading}
        >
          {downloading ? "⏳ Downloading..." : "📥 Download Invoice"}
        </button>
        {error && <span className="error-message">{error}</span>}
      </div>

      <div className="invoice-container print-only">
        <div className="invoice-header">
          <div>
            <h1 style={{ fontSize: "28px", color: "#007bff", margin: 0 }}>INVOICE</h1>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: "0 0 5px 0", fontSize: "16px", color: "#666" }}>
              Invoice #{order.id}
            </p>
            <p style={{ margin: 0, fontSize: "14px", color: "#999" }}>
              Date: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        <div style={{ 
          backgroundColor: "#d4edda", 
          color: "#155724", 
          padding: "12px", 
          borderRadius: "4px", 
          marginBottom: "20px",
          fontWeight: "bold",
          textAlign: "center"
        }}>
          ✓ Payment Successful
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginBottom: "30px" }}>
          <div>
            <h3 style={{ marginTop: 0, fontSize: "14px", textTransform: "uppercase", color: "#666" }}>
              Bill To
            </h3>
            <p style={{ fontSize: "16px", fontWeight: "bold", margin: 0 }}>
              {order.customerName || "N/A"}
            </p>
            <p style={{ fontSize: "14px", color: "#666", margin: "5px 0 0 0" }}>
              Order ID: #{order.id}
            </p>
          </div>
          <div>
            <h3 style={{ marginTop: 0, fontSize: "14px", textTransform: "uppercase", color: "#666" }}>
              Company Info
            </h3>
            <p style={{ fontSize: "16px", fontWeight: "bold", margin: 0 }}>
              Billing System
            </p>
            <p style={{ fontSize: "14px", color: "#666", margin: "5px 0 0 0" }}>
              support@billing.com
            </p>
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
          <thead>
            <tr style={{ backgroundColor: "#007bff", color: "white" }}>
              <th style={{ padding: "12px", textAlign: "left", fontSize: "14px", fontWeight: "bold" }}>
                Product
              </th>
              <th style={{ padding: "12px", textAlign: "center", fontSize: "14px", fontWeight: "bold" }}>
                Quantity
              </th>
              <th style={{ padding: "12px", textAlign: "right", fontSize: "14px", fontWeight: "bold" }}>
                Unit Price
              </th>
              <th style={{ padding: "12px", textAlign: "right", fontSize: "14px", fontWeight: "bold" }}>
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "12px", fontSize: "14px" }}>
                  {item.productName || item.name || "Product"}
                </td>
                <td style={{ padding: "12px", fontSize: "14px", textAlign: "center" }}>
                  {item.quantity}
                </td>
                <td style={{ padding: "12px", fontSize: "14px", textAlign: "right" }}>
                  ₹{item.price?.toFixed(2) || "0.00"}
                </td>
                <td style={{ padding: "12px", fontSize: "14px", textAlign: "right" }}>
                  ₹{(item.price * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ textAlign: "right", borderTop: "2px solid #ddd", paddingTop: "15px" }}>
          <div style={{ marginBottom: "10px", fontSize: "14px" }}>
            <span>Subtotal: </span>
            <span style={{ marginLeft: "100px" }}>₹{subtotal.toFixed(2)}</span>
          </div>
          <div style={{ marginBottom: "10px", fontSize: "14px" }}>
            <span>Tax (18% GST): </span>
            <span style={{ marginLeft: "100px" }}>₹{tax.toFixed(2)}</span>
          </div>
          <div style={{ 
            marginTop: "15px", 
            paddingTop: "15px", 
            borderTop: "1px solid #ddd",
            fontSize: "18px",
            fontWeight: "bold",
            color: "#007bff"
          }}>
            <span>Total Amount: </span>
            <span style={{ marginLeft: "100px" }}>₹{total.toFixed(2)}</span>
          </div>
        </div>

        <div style={{ 
          marginTop: "40px", 
          paddingTop: "20px", 
          borderTop: "1px solid #ddd",
          textAlign: "center",
          color: "#999",
          fontSize: "12px"
        }}>
          <p style={{ margin: 0 }}>Thank you for your purchase!</p>
          <p style={{ margin: "5px 0 0 0" }}>This is an electronically generated invoice.</p>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
