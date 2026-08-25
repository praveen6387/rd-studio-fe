const DEFAULT_BASE_URL = "https://rd-studio-be-production-atearna2.up.railway.app";

const getBaseUrl = () => {
  try {
    const configured = process.env.API_BASE_URL || DEFAULT_BASE_URL;
    const url = new URL(configured);
    return url.origin;
  } catch {
    return DEFAULT_BASE_URL;
  }
};

const BASE_URL = getBaseUrl();

export const endpoint = {
  login: BASE_URL + "/api/base/auth/login/",
  users: BASE_URL + "/api/base/auth/user/",
  current_user: BASE_URL + "/api/base/auth/current-user/",
  media_library: BASE_URL + "/api/base/operation/media/",
  upload_media: BASE_URL + "/api/base/operation/media/",
};
