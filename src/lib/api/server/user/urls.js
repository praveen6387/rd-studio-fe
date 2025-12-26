import { endpoint } from "../endpoint";

export const getUsers = async (token) => {
  const url = endpoint.users;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    return null;
    throw new Error("Failed to get users");
  }
  return res.json();
};

export const getCurrentUser = async (token) => {
  const url = endpoint.current_user;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    return null;
    throw new Error("Failed to get current user");
  }
  return res.json();
};
