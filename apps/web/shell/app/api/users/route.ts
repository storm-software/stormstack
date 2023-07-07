import { ConsoleLogger } from "@open-system/core-shared-utilities";
import "@sentry/tracing";
import { NextRequest, NextResponse } from "next/server";
// import { repository } from "../../../state/reaction-repository";

// export const runtime = "edge";

export const DOMAIN_NAME = "reactions";

export async function GET(req: NextRequest) {
  ConsoleLogger.info(`Starting GET request to ${DOMAIN_NAME} view store.`);

  return NextResponse.json({
    data: {
      userId: "1234122",
    },
  });
}

/*export async function POST(req: NextRequest) {
  console.log("In this");

  const request = (await req.json()) as Reaction;

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

  revalidateTag(DOMAIN_NAME);

  return NextResponse.json({ revalidated: true, now: Date.now() });
}*/
