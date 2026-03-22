import { getToken } from "../utils/tokenUtils";

const BASE_URL = "http://localhost:8080/api/orders";

export const createOrder = async (customerName) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ customerName }),
  });
  if (!res.ok) throw new Error("Failed to create order");
  const json = await res.json();
  return json.data || json;
};

export const addItemToOrder = async (orderId, item) => {
  const res = await fetch(`${BASE_URL}/${orderId}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error("Failed to add item to order");
  const json = await res.json();
  return json.data || json;
};

export const removeItemFromOrder = async (orderId, itemId) => {
  const res = await fetch(`${BASE_URL}/${orderId}/items/${itemId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("Failed to remove item from order");
  const json = await res.json();
  return json.data || json;
};

export const getAllOrders = async () => {
  const token = getToken();
  console.log("🔑 Token exists:", !!token);
  if (token) {
    console.log("🔑 Token preview:", token.substring(0, 20) + "...");
  } else {
    console.error("❌ No token found! User might not be authenticated.");
  }
  
  const res = await fetch(BASE_URL, {
    method: "GET",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
  });
  console.log(`📡 GET ${BASE_URL} - Status: ${res.status}`);
  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ API Error Response:", errorText);
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  const json = await res.json();
  console.log("Orders Response:", json);
  return json.data || json || [];
};

export const getOrderById = async (id) => {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "GET",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
  });
  console.log(`📡 GET ${BASE_URL}/${id} - Status: ${res.status}`);
  if (!res.ok) throw new Error(`Failed to fetch order: HTTP ${res.status}`);
  const json = await res.json();
  console.log(`Order #${id} Response:`, json);
  return json.data || json;
};

export const getOrdersByCustomer = async (customerName) => {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/user/${customerName}`, {
    method: "GET",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
  });
  if (!res.ok) throw new Error("Failed to fetch customer orders");
  const json = await res.json();
  console.log(`🔍 Search Results for '${customerName}':`, json);
  // Handle both array response and data wrapper response
  if (Array.isArray(json)) {
    return json;
  }
  return json.data || [];
};

export const deleteOrder = async (id) => {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
  });
  if (!res.ok) throw new Error("Failed to delete order");
  const json = await res.json();
  return json.data || json;
};
