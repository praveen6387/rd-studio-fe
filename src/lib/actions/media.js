"use server";

import { revalidateTag } from "next/cache";

export async function revalidateAPITag() {
  revalidateTag("media-library");
}
