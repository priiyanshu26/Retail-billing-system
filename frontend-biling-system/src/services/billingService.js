import { getToken } from "../utils/tokenUtils";

const BASE_URL = "http://localhost:8080/api/billing";

// Generate billing for an order
export const generateBilling = async (orderId) => {
  const res = await fetch(`${BASE_URL}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ orderId }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to generate billing");
  }
  const json = await res.json();
  return json.data || json;
};

// Get billing details for an order
export const getBillingDetails = async (orderId) => {
  const res = await fetch(`${BASE_URL}/${orderId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch billing details");
  const json = await res.json();
  return json.data || json;
};

// Get all billings for user
export const getAllBillings = async () => {
  const res = await fetch(`${BASE_URL}/all`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch billings");
  const json = await res.json();
  return json.data || [];
};

// Download billing as PDF
export const downloadBillingPDF = async (orderId) => {
  const res = await fetch(`${BASE_URL}/download/${orderId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) throw new Error("Failed to download billing");
  return res.blob();
};
