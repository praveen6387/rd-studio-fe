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
  media_library: "/rd-api/media-library",
  upload_media: "/rd-api/base/operation/media/",
  external_media: "/rd-api/base/operation/media/external/",
  create_transaction: "/rd-api/base/payment/create-payment-transaction/",
  payment_transaction_view: "/rd-api/base/payment/update-payment-transaction/",
};

function toRailwayUrl(path) {
  return `${RAILWAY_API}${path.replace(/^\/rd-api/, "/api")}`;
}

function shouldFallbackToRailway(res) {
  if (!res) return true;
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("text/html")) return true;
  if (res.status === 404 || res.status >= 500) return true;
  return false;
}

export async function apiFetch(path, options) {
  let res;
  try {
    res = await fetch(path, options);
    if (!shouldFallbackToRailway(res)) return res;
  } catch {
    res = undefined;
  }

  try {
    return await fetch(toRailwayUrl(path), options);
  } catch {
    if (res) return res;
    throw new Error("Failed to reach API");
  }
}
