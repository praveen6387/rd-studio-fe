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
    throw new Error("Failed to get media library");
  }
  return res.json();
};
