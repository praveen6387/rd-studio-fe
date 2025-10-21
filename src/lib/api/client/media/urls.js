import { authToken, endpoint } from "@/lib/api/client/endpoint";

export const getMediaLibrary = async () => {
  const url = endpoint.media_library;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to get media library");
  }
  return res.json();
};

export const createMedia = async (formData) => {
  const url = endpoint.upload_media;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: authToken,
    },
    body: formData,
  });
  if (!res.ok) {
    throw new Error("Failed to create media");
  }
  return res.json();
};

export const getExternalMediaById = async (mediaId) => {
  const url = endpoint.external_media + mediaId + "/";
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to get external media");
  }
  return res.json();
};
