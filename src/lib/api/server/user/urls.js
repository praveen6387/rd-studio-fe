import { endpoint } from "../endpoint";
import { rewriteApiUrls } from "@/lib/utils";

export const getUsers = async (token) => {
  const emptyUsers = { users: [] };
  if (!token) return emptyUsers;

  const url = endpoint.users;
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    if (!res.ok) return emptyUsers;

    return rewriteApiUrls(await res.json());
  } catch (error) {
    console.error("Failed to get users:", error);
    return emptyUsers;
  }
};

export const getCurrentUser = async (token) => {
  if (!token) return null;

  const url = endpoint.current_user;
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    if (!res.ok) return null;

    return rewriteApiUrls(await res.json());
  } catch (error) {
    console.error("Failed to get current user:", error);
    return null;
  }
};
