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
  login: "/api/base/auth/login/",
  signup: "/api/base/auth/signup/",
  current_user: "/api/base/auth/current-user/",
  media_library: "/api/media-library",
  upload_media: "/api/base/operation/media/",
  external_media: "/api/base/operation/media/external/",
  create_transaction: "/api/base/payment/create-payment-transaction/",
  payment_transaction_view: "/api/base/payment/update-payment-transaction/",
};

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
    return await fetch(`${RAILWAY_API}${path}`, options);
  } catch {
    if (res) return res;
    throw new Error("Failed to reach API");
  }
}
