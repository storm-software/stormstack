import {
  ConsoleLogger,
  parseInteger,
} from "@open-system/core-shared-utilities";
import "@sentry/tracing";
import { NextRequest, NextResponse } from "next/server";
// import { repository } from "../../../state/reaction-repository";

// export const runtime = "edge";

const { HTTP_PAGE_LIMIT } = process.env;

/**
 * Contains a page of results for message or presence history, stats, or REST presence requests. A `PaginatedResult` response from a REST API paginated query is also accompanied by metadata that indicates the relative queries available to the `PaginatedResult` object.
 */
export interface HttpPaginatedResult<T = any> {
  /**
   * Contains the current page of results; for example, an array of {@link Message} or {@link PresenceMessage} objects for a channel history request.
   */
  data: T[];

  /**
   * Amount of records returned by request
   */
  count: number;

  /**
   * Total amount of records in the view store
   */
  total: number;

  /**
   * Amount of records to offset the search request
   */
  offset: number;

  /**
   * Returns `true` if this page is the last page and returns `false` if there are more pages available by calling next available.
   *
   * @returns Whether or not this is the last page of results.
   */
  isLast: boolean;
}

/**
 * Contains a page of results for message or presence history, stats, or REST presence requests. A `PaginatedResult` response from a REST API paginated query is also accompanied by metadata that indicates the relative queries available to the `PaginatedResult` object.
 */
export interface HttpErrorResult {
  /**
   * The error code in HTTP header is sent in the response.
   */
  errorCode: number;

  /**
   * The error message sent in the response.
   */
  errorMessage: string;
}

export const DOMAIN_NAME = "reactions";

export async function GET(req: NextRequest) {
  ConsoleLogger.info(`Starting GET request to ${DOMAIN_NAME} view store.`);

  const { searchParams } = req.nextUrl;
  const limit = parseInteger(
    searchParams.get("limit"),
    parseInteger(HTTP_PAGE_LIMIT, 100)
  );
  const offset = parseInteger(searchParams.get("offset"), 0);

  const contentId = searchParams.get("contentId");
  const type = searchParams.get("type");
  if (!contentId || !type) {
    return NextResponse.json(
      {
        errorCode: 400,
        errorMessage: `Required search parameters were not provided in request: ${
          !contentId && !type
            ? "contentId and type"
            : !contentId
            ? "contentId"
            : "type"
        }.`,
      },
      { status: 400 }
    );
  }

  /*const search = repository
    .search()
    .where("contentId")
    .equals(contentId)
    .and("type")
    .equals(type);

  const totalReq = search.return.count();
  const dataReq = search.return.page(offset, limit);

  // Wait for the promises to resolve
  const [total, data] = await Promise.all([totalReq, dataReq]);*/

  const total = 0;
  const data = [];
  if (!total || !data || data.length === 0) {
    return NextResponse.json(
      {
        errorCode: 404,
        errorMessage: "No results found",
      },
      { status: 404 }
    );
  }

  const count = data.length;
  ConsoleLogger.success(`${total} total items in ${DOMAIN_NAME} read store`);
  ConsoleLogger.success(
    `${count} item(s) returned from ${DOMAIN_NAME} read store`
  );

  return NextResponse.json({
    data,
    count,
    total,
    offset: offset + count,
    isLast: offset + count >= total,
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
