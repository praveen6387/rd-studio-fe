import { endpoint } from "@/lib/api/client/endpoint";

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
