export { Headers } from "@open-system/core-client-data-access";
export {
  BaseCloudflareEnv,
  R2Bucket,
  R2ListOptions,
} from "@open-system/core-shared-cloudflare";
export { ConsoleLogger } from "@open-system/core-shared-utilities";

interface Env extends BaseCloudflareEnv {
  CONTACT_ATTACHMENTS_BUCKET: R2Bucket;
}

function objectNotFound(objectName: string): Response {
  return new Response(
    `<html><body>R2 object "<b>${objectName}</b>" not found</body></html>`,
    {
      status: 404,
      headers: {
        "content-type": "text/html; charset=UTF-8",
      },
    }
  );
}

export async function handleRequest(
  request: Request,
  env: Env
): Promise<Response> {
  const bucket = env.CONTACT_ATTACHMENTS_BUCKET;

  const url = new URL(request.url);
  const objectName = url.pathname.slice(1);

  ConsoleLogger.log(`${request.method} object ${objectName}: ${request.url}`);

  if (request.method === "GET" || request.method === "HEAD") {
    if (objectName === "") {
      if (request.method == "HEAD") {
        return new Response(undefined, { status: 400 });
      }

      const options: R2ListOptions = {
        prefix: url.searchParams.get("prefix") ?? undefined,
        delimiter: url.searchParams.get("delimiter") ?? undefined,
        cursor: url.searchParams.get("cursor") ?? undefined,
        include: ["customMetadata", "httpMetadata"],
      };
      ConsoleLogger.log(JSON.stringify(options));

      const listing = await bucket.list(options);
      return new Response(JSON.stringify(listing), {
        headers: {
          "content-type": "application/json; charset=UTF-8",
        },
      });
    }

    if (request.method === "GET") {
      const object = await bucket.get(objectName, {
        range: request.headers,
        onlyIf: request.headers,
      });

      if (object === null) {
        return objectNotFound(objectName);
      }

      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set("etag", object.httpEtag);
      if (object.range) {
        headers.set(
          "content-range",
          `bytes ${object.range.offset}-${object.range.end}/${object.size}`
        );
      }
      const status = object.body
        ? request.headers.get("range") !== null
          ? 206
          : 200
        : 304;
      return new Response(object.body, {
        headers,
        status,
      });
    }

    const object = await bucket.head(objectName);

    if (object === null) {
      return objectNotFound(objectName);
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    return new Response(null, {
      headers,
    });
  }
  if (request.method === "PUT" || request.method == "POST") {
    const object = await bucket.put(objectName, request.body, {
      httpMetadata: request.headers,
    });
    return new Response(null, {
      headers: {
        "etag": object.httpEtag,
      },
    });
  }
  if (request.method === "DELETE") {
    await bucket.delete(url.pathname.slice(1));
    return new Response();
  }

  return new Response(`Unsupported method`, {
    status: 400,
  });
}
