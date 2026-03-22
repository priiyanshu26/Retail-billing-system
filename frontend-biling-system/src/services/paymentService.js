import { getToken } from "../utils/tokenUtils";

const BASE_URL = "http://localhost:8080/api/payments";

async function safeParseResponse(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

export const createPayment = async (paymentData) => {
  try {
    const res = await fetch(`${BASE_URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(paymentData),
    });
    
    const json = await safeParseResponse(res);
    
    if (!res.ok) {
      throw new Error(json?.message || "Failed to create payment");
    }
    
    return json.data || json;
  } catch (error) {
    throw error;
  }
};

export const verifyPayment = async (verificationData) => {
  try {
    const res = await fetch(`${BASE_URL}/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(verificationData),
    });
    
    const json = await safeParseResponse(res);
    
    if (!res.ok) {
      throw new Error(json?.message || "Failed to verify payment");
    }
    
    return json.data || json;
  } catch (error) {
    throw error;
  }
};

export const getPaymentStatus = async (orderId) => {
  try {
    const res = await fetch(`${BASE_URL}/status/${orderId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    
    const json = await safeParseResponse(res);
    
    if (!res.ok) {
      throw new Error(json?.message || "Failed to fetch payment status");
    }
    
    return json.data || json;
  } catch (error) {
    throw error;
  }
};
