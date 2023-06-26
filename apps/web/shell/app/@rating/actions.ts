'use server';

import { Rate } from '@open-system/engagement-data-access/server';
import { revalidateTag } from 'next/cache';

export async function handleSubmit(values: { data: Rate }) {
  console.log(values);

  const result = await fetch(
    `${process.env.NEXT_PUBLIC_REACTION_QUERY_URL}/api/rating/${values.data.contentId}`,
    {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values.data),
    }
  );

  revalidateTag('rating');
  return result;
}
