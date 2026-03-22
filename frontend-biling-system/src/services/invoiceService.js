import { getToken } from "../utils/tokenUtils";

const BASE_URL = "http://localhost:8080/api/invoices";

// Generate invoice for an order
export const generateInvoice = async (orderId) => {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ orderId }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Failed to generate invoice:", errorText);
    throw new Error("Failed to generate invoice");
  }

  const json = await res.json();
  return json.data || json;
};

// Get invoice details
export const getInvoiceDetails = async (invoiceId) => {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/${invoiceId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch invoice details");

  const json = await res.json();
  return json.data || json;
};

// Get invoice by order ID
export const getInvoiceByOrderId = async (orderId) => {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/order/${orderId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch invoice");

  const json = await res.json();
  return json.data || json;
};

// Download invoice as PDF
export const downloadInvoicePDF = async (invoiceId) => {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/download/${invoiceId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to download invoice");

  return res.blob();
};

// Download invoice by order ID as PDF
export const downloadInvoiceByOrderId = async (orderId) => {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/download/order/${orderId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to download invoice");

  return res.blob();
};

// Helper function to trigger download
export const triggerInvoiceDownload = (blob, fileName = "invoice.pdf") => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Helper function to print invoice
export const printInvoice = (htmlContent) => {
  const printWindow = window.open("", "", "height=600,width=800");
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.print();
};

// Get all invoices for admin
export const getAllAdminInvoices = async () => {
  const token = getToken();
  const res = await fetch("http://localhost:8080/api/billing/admin/invoices", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch admin invoices");

  const json = await res.json();
  return json.data || json;
};
