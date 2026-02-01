import { endpoint, getAuthToken } from "@/lib/api/client/endpoint";

export const userLogin = async (data) => {
  const url = endpoint.login;
  const res = await fetch(url, {
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
  return res.json();
};

export const userSignup = async (data) => {
  const url = endpoint.signup;
  const res = await fetch(url, {
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
  return res.json();
};

export const updateSocialLinks = async (data) => {
  const url = endpoint.update_social_links;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuthToken(),
    },
    body: JSON.stringify({ social_links: data }),
  });

  if (!res.ok) {
    throw new Error("Failed to update social links");
  }
  return res.json();
};
