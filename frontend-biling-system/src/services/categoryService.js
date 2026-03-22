import { getToken } from "../utils/tokenUtils";

const BASE_URL = "http://localhost:8080/api/categories";

export const getAllCategories = async () => {
  const res = await fetch(BASE_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch categories");
  const json = await res.json();
  return json.data || [];
};

export const createCategory = async (category) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(category),
  });
  if (!res.ok) throw new Error("Failed to create category");
  const json = await res.json();
  return json.data || json;
};

export const updateCategory = async (id, category) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(category),
  });
  if (!res.ok) throw new Error("Failed to update category");
  const json = await res.json();
  return json.data || json;
};

export const deleteCategory = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) throw new Error("Failed to delete category");
  const json = await res.json();
  return json.data || json;
};
