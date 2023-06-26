"use server";

import { FormSubmitHandlerParams } from "@open-system/core-data-access";
import { ServerResult } from "@open-system/core-utilities";
import { Rate } from "@open-system/engagement-data-access";
import { revalidateTag } from "next/cache";

export async function giveRating(
  request: FormSubmitHandlerParams<Rate>
): Promise<ServerResult> {
  console.log("Submit Rate");
  revalidateTag("/");

  return {
    data: {},
    status: 200,
  };
}
