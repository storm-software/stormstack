"use server";

import { Contact } from "@open-system/contact-data-access";
import { revalidateTag } from "next/cache";

export async function handleSubmit(formData: Contact) {
  console.log("Submit contact");

  revalidateTag("contact");
}
