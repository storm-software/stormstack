"use server";

import { Contact } from "@open-system/contact-data-access";
import { FormSubmitHandlerParams } from "@open-system/core-data-access";
import { ServerResult } from "@open-system/core-utilities";
import { revalidateTag } from "next/cache";

export async function subscribe(
  request: FormSubmitHandlerParams<Contact>
): Promise<ServerResult> {
  console.log("Submit subscription");
  revalidateTag("subscription");

  return {
    data: {},
    status: 200,
  };
}

export async function addContact(
  request: FormSubmitHandlerParams<Contact>
): Promise<ServerResult> {
  console.log("Submit contact");
  revalidateTag("contact");

  return {
    data: {},
    status: 200,
  };
}
