import { getAuthToken, endpoint } from "@/lib/api/client/endpoint";

export const createTransaction = async (data) => {
  const url = endpoint.create_transaction;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: getAuthToken(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }
  return res.json();
};
