import Cookies from "js-cookie";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://192.168.16.40:9000";

export const getAuthToken = () => {
  let authToken = "";
  if (Cookies.get("access_token")) {
    authToken = `Bearer ${Cookies.get("access_token")}`;
  }

  return authToken;
};

export const endpoint = {
  login: BASE_URL + "/api/base/auth/login/",
  media_library: BASE_URL + "/api/media-library",
  upload_media: BASE_URL + "/api/base/operation/media/",
  external_media: BASE_URL + "/api/base/operation/media/external/",
};
