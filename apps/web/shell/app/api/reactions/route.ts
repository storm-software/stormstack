import "@sentry/tracing";
import { NextRequest, NextResponse, revalidatePath } from "next/server";
import { getConnection } from "../../../redis/get-connection";
import { getRepository } from "../../../redis/reaction-repository";
import { Reaction } from "../../../redis/reaction-schema";

// export const runtime = "edge";

export async function POST(req: NextRequest) {
  console.log("In this");

  const request = (await req.json()) as Reaction;

  const connection = await getConnection();

  const repository = await getRepository(connection);

  const id = await repository
    .search()
    .where("contentId")
    .equals(request.contentId)
    .and("type")
    .equals(request.type)
    .return.firstId();
  if (id) {
    await repository.remove(id);
  }
  await repository.save(request);
  await connection.quit();

  revalidatePath("/");

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
