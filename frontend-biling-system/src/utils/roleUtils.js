export const decodeToken = (token) => {
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch (error) {
    return null;
  }
};

export const getUserRole = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.authorities) return null;

  // Example: ["ROLE_ADMIN"] or ["ROLE_USER"]
  return decoded.authorities[0];
};

export const getUsername = (token) => {
  const decoded = decodeToken(token);
  return decoded?.sub || null;
};

export const getUserId = (token) => {
  const decoded = decodeToken(token);
  // Try common field names for user ID
  return decoded?.userId || decoded?.id || decoded?.user_id || null;
};
