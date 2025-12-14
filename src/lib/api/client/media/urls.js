import { getAuthToken, endpoint } from "@/lib/api/client/endpoint";

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
      Authorization: getAuthToken(),
    },
    body: formData,
  });
  if (!res.ok) {
    throw new Error("Failed to create media");
  }
  return res.json();
};

export const updateMedia = async (formData, mediaId) => {
  const url = endpoint.upload_media + mediaId + "/";
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: getAuthToken(),
    },
    body: formData,
  });
  if (!res.ok) {
    throw new Error("Failed to update media");
  }
  return res.json();
};

export const deleteMedia = async (mediaId) => {
  const url = endpoint.upload_media + mediaId + "/";
  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: getAuthToken(),
    },
  });
  if (!res.ok) {
    throw new Error("Failed to delete media");
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
