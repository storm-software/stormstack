import { fetchHttpHandler } from "@open-system/core-typescript-utilities";
import { createApi } from "@reduxjs/toolkit/query/react";

// initialize an empty api service that we'll inject endpoints into later as needed
export const apiSlice = createApi({
  reducerPath: "reactionApi",
  baseQuery: fetchHttpHandler({ baseUrl: "http://reaction.api/api/v1" }),
  endpoints: () => ({}),
});
