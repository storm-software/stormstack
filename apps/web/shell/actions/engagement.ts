"use server";

import { FormSubmitHandlerParams } from "@open-system/core-shared-data-access";
import { Rate } from "@open-system/engagement-shared-data-access";
import { revalidateTag } from "next/cache";

export async function giveRating(request: FormSubmitHandlerParams<Rate>) {
  console.log(request);
  console.log("Submit Rate");

  const result = await fetch(
    `${process.env.BASE_URL}/api/rating/${request.data.contentId}`,
    {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request.data),
    }
  );

  revalidateTag("rating");

  return {
    data: {},
    status: 200,
  };
}
