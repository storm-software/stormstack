"use server";

import { getUniqueId } from "@open-system/core-utilities/server";
import { cookies } from "next/headers";

export async function addUser() {
  const userId = getUniqueId();

  const cookieStore = cookies();
  cookieStore.set("user-id", userId);

  return userId;
}

export async function agreeToPrivacyPolicy() {
  const cookieStore = cookies();
  cookieStore.set("agreed-to-privacy-policy", "true");
}
