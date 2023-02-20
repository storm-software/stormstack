import { fetchHttpHandler } from "@open-system/core-typescript-utilities";
import { createApi } from "@reduxjs/toolkit/query/react";

// initialize an empty api service that we'll inject endpoints into later as needed
export const apiSlice = createApi({
  baseQuery: fetchHttpHandler({ baseUrl: "http://localhost:5000" }),
  endpoints: () => ({}),
});
