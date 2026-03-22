import { getToken } from "../utils/tokenUtils";

const BASE_URL = "http://localhost:8080/api/products";

export const getAllProducts = async () => {
  const res = await fetch(BASE_URL, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  console.log(`📡 GET ${BASE_URL} - Status: ${res.status}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  const json = await res.json();
  console.log("📦 Raw API Response:", json);
  const data = json.data || [];
  console.log("✅ Extracted Products Array:", data);
  return data;
};

export const getProductsByCategory = async (categoryId) => {
  const res = await fetch(`${BASE_URL}/category/${categoryId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("Failed to fetch products by category");
  const json = await res.json();
  return json.data || [];
};

export const createProduct = async (product) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Failed to create product");
  const json = await res.json();
  return json.data || json;
};

export const updateProduct = async (id, product) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Failed to update product");
  const json = await res.json();
  return json.data || json;
};

export const getProductById = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("Failed to fetch product");
  const json = await res.json();
  return json.data || json;
};

export const deleteProduct = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("Failed to delete product");
  const json = await res.json();
  return json.data || json;
};
