import { fetchHttpHandler } from "@open-system/core-utilities";
import { createApi } from "@reduxjs/toolkit/query/react";

// initialize an empty api service that we'll inject endpoints into later as needed
export const reactionApiSlice = createApi({
  reducerPath: "reactionApi",
  baseQuery: fetchHttpHandler({ baseUrl: `${ process.env.NEXT_PUBLIC_REACTION_API_HOST }/api/v1` }),
  endpoints: () => ({}),
});
