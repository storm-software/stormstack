// Or from '@reduxjs/toolkit/query' if not using the auto-generated hooks
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// initialize the contact api service that we'll inject endpoints into later as needed
export const contactApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/contacts" }),
  endpoints: () => ({}),
});
