import Cookies from "js-cookie";

const RAILWAY_API = "https://rd-studio-be-production-atearna2.up.railway.app";

export const getAuthToken = () => {
  let authToken = "";
  if (Cookies.get("access_token")) {
    authToken = `Bearer ${Cookies.get("access_token")}`;
  }

  return authToken;
};

export const endpoint = {
  login: "/rd-api/base/auth/login/",
  signup: "/rd-api/base/auth/signup/",
  current_user: "/rd-api/base/auth/current-user/",
  media_library: "/rd-api/base/operation/media/",
  upload_media: "/rd-api/base/operation/media/",
  external_media: "/rd-api/base/operation/media/external/",
  create_transaction: "/rd-api/base/payment/create-payment-transaction/",
  payment_transaction_view: "/rd-api/base/payment/update-payment-transaction/",
};

function toRailwayUrl(path) {
  return `${RAILWAY_API}${path.replace(/^\/rd-api/, "/api")}`;
}

export async function apiFetch(path, options) {
  // Browser (including Jio) must stay on rd-studio.in. Railway DNS fails on Jio.
  // Server (Vercel/local Node) can reach Railway directly.
  const url = typeof window === "undefined" ? toRailwayUrl(path) : path;
  return fetch(url, options);
}
