const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:9000";

export const authToken =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzYwMjU0Mzk0LCJpYXQiOjE3NTk2NDk1OTQsImp0aSI6IjNlYTE3MGJhZDRiODQ0NDNhYWU2M2Y3NTM5NGIzODA0IiwidXNlcl9pZCI6IjQiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUzLmNvbSIsInJvbGUiOjAsImlzX2FkbWluIjpmYWxzZSwiaXNfc3VwZXJfYWRtaW4iOmZhbHNlfQ.YXRLN8af65-qMX2xYJbzEF6NZjmJxPuqGvh8-nY3VUM";

export const endpoint = {
  login: BASE_URL + "/api/auth/login",
  media_library: BASE_URL + "/api/media-library",
  upload_media: BASE_URL + "/api/base/operation/media/",
  external_media: BASE_URL + "/api/base/operation/media/external/",
};
