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
    throw new Error(JSON.stringify(error));
  }
  return res.json();
};

export const updatePaymentTransaction = async (id, payload) => {
  const url = endpoint.payment_transaction_view + id + "/";
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: getAuthToken(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(JSON.stringify(error));
  }
  return res.json();
};
