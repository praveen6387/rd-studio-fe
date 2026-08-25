import { endpoint, getAuthToken, apiFetch } from "@/lib/api/client/endpoint";
import { rewriteApiUrls } from "@/lib/utils";

export const userLogin = async (data) => {
  const url = endpoint.login;
  const res = await apiFetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Failed to Login");
  }
  return rewriteApiUrls(await res.json());
};

export const userSignup = async (data) => {
  const url = endpoint.signup;
  const res = await apiFetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Failed to signup");
  }
  return rewriteApiUrls(await res.json());
};

export const updateSocialLinks = async (data) => {
  const url = endpoint.current_user;
  const res = await apiFetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuthToken(),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update social links");
  }
  return rewriteApiUrls(await res.json());
};
