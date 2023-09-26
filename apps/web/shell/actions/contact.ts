"use server";

import { Contact } from "@stormstack/contact-shared-data-access";
import { FormSubmitHandlerParams } from "@stormstack/core-shared-data-access";
import { ServerResult } from "@stormstack/core-shared-utilities";
import { revalidateTag } from "next/cache";

export async function subscribe(
  request: FormSubmitHandlerParams<Contact>
): Promise<ServerResult> {
  console.log("Submit subscription");
  revalidateTag("subscription");

  return {
    data: {},
    status: 200
  };
}

export async function addContact(
  request: FormSubmitHandlerParams<Contact>
): Promise<ServerResult> {
  console.log("Submit contact");
  revalidateTag("contact");

  return {
    data: {},
    status: 200
  };
}
