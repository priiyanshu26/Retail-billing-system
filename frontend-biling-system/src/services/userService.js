import { getToken } from "../utils/tokenUtils";

const BASE_URL = "http://localhost:8080/api/users";

// Get all users
export const getAllUsers = async () => {
  const token = getToken();
  const res = await fetch(BASE_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch users");

  const json = await res.json();
  return json.data || json;
};

// Get user by ID
export const getUserById = async (userId) => {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch user details");

  const json = await res.json();
  return json.data || json;
};

// Delete user by ID
export const deleteUser = async (userId) => {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete user");

  const json = await res.json();
  return json;
};
