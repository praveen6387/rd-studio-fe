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
    throw new Error("Failed to login");
  }
  return res.json();
};
