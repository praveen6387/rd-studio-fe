const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:9000";

export const endpoint = {
  login: BASE_URL + "/api/auth/login",
  media_library: BASE_URL + "/api/base/operation/media/",
  upload_media: BASE_URL + "/api/base/operation/media/",
};
