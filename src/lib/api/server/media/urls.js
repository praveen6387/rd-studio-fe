import { endpoint } from "../endpoint";
import { rewriteApiUrls } from "@/lib/utils";

export const getMediaLibrary = async (token) => {
  const emptyLibrary = { user: null, data: [] };
  if (!token) return emptyLibrary;

  const url = endpoint.media_library;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    if (!res.ok) return emptyLibrary;

    return rewriteApiUrls(await res.json());
  } catch (error) {
    console.error("Failed to get media library:", error);
    return emptyLibrary;
  }
};

export const getMediaLibraryById = async (mediaId, token) => {
  if (!token || !mediaId) return null;

  const url = endpoint.media_library + mediaId + "/";
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    if (!res.ok) return null;

    return rewriteApiUrls(await res.json());
  } catch (error) {
    console.error("Failed to get media library by id:", error);
    return null;
  }
};
