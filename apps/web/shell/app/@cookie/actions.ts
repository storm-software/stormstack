"use server";

import { UniqueIdGenerator } from "@open-system/core-shared-utilities";
import { cookies } from "next/headers";

export async function addUser() {
  const userId = UniqueIdGenerator.generate();

  const cookieStore = cookies();
  cookieStore.set("user-id", userId);

  return userId;
}

export async function agreeToPrivacyPolicy() {
  const cookieStore = cookies();
  cookieStore.set("agreed-to-privacy-policy", "true");
}
