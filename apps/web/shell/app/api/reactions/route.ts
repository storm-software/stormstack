import "@sentry/tracing";
import { NextRequest, NextResponse, revalidateTag } from "next/server";
import { getConnection } from "../../../redis/get-connection";
import { getRepository } from "../../../redis/reaction-repository";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  console.log("In this");

  const request = await req.json();

  const connection = await getConnection();

  const repository = await getRepository(connection);
  await repository.save(request);

  repository.createIndex();

  await connection.quit();

  revalidateTag("repository");

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
