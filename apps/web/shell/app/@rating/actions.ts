"use server";

import { revalidateTag } from "next/cache";

export async function handleSubmit(values: {
  contentId: string;
  rating: number;
}) {
  console.log(values);

  const result = await fetch(
    `${process.env.NEXT_PUBLIC_REACTION_QUERY_URL}/api/rating/${values.contentId}`,
    {
      method: "post",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }
  );

  revalidateTag("rating");
  return result;
}
