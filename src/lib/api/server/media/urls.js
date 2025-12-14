import { endpoint } from "../endpoint";

export const getMediaLibrary = async (token) => {
  const url = endpoint.media_library;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    next: { tags: ["media-library"] }, // Add cache tag for revalidation
  });
  if (!res.ok) {
    return null;
    throw new Error("Failed to get media library");
  }
  return res.json();
};

export const getMediaLibraryById = async (mediaId, token) => {
  const url = endpoint.media_library + mediaId + "/";
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to get media library by id");
  }
  return res.json();
};
