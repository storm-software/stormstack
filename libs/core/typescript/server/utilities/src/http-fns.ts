/**
 * Returns the headers that should be forwarded from the ClientRequest as headers
 * in the next request sent to the node
 * @param request A Request
 * @returns A record with the headers where keys are the names and values are the header values
 */
export const forwardedHeaders = (request: Request) => {
  const forwardedHeaders = ["Authorization", "X-Request-Id"];
  const headers: Record<string, string> = {};
  if (request?.headers) {
    for (const header of forwardedHeaders) {
      const value = request.headers.get(header);
      if (value) {
        headers[header] = value;
      }
    }
  }
  return headers;
};
