
import axios from "axios";

const BASE_URL = "http://localhost:8080/auth";

export const loginApi = async (credentials) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, credentials);
    return response.data; // { token }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Login failed";
    throw new Error(errorMessage);
  }
};

export const registerApi = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/register`, userData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Registration failed";
    throw new Error(errorMessage);
  }
};
