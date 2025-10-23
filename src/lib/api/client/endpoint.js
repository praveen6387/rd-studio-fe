const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://192.168.16.40:9000";

export const authToken =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzYxNjg3MTI5LCJpYXQiOjE3NjEwODIzMjksImp0aSI6IjFkMDIyNmFlMjU4ZjQxZWE5NTAyNmEwMjllNzEwYTQ0IiwidXNlcl9pZCI6IjEiLCJlbWFpbCI6InN1bmlsQGdtYWlsLmNvbSIsInJvbGUiOjIsImlzX2FkbWluIjpmYWxzZSwiaXNfc3VwZXJfYWRtaW4iOmZhbHNlfQ.OJyZJyd6reKfozhjXb2N678GrtdAbQdYV8JXe4_ecSc";

export const endpoint = {
  login: BASE_URL + "/api/base/auth/login/",
  media_library: BASE_URL + "/api/media-library",
  upload_media: BASE_URL + "/api/base/operation/media/",
  external_media: BASE_URL + "/api/base/operation/media/external/",
};
