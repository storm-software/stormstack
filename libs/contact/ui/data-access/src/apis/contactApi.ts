import { emptySplitApi as api } from "./emptyApi";
export const addTagTypes = ["Contact"] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: build => ({
      getRequests: build.query<GetRequestsApiResponse, GetRequestsApiArg>({
        query: queryArg => ({
          url: `/requests`,
          headers: { userId: queryArg.userId },
        }),
        providesTags: ["Contact"],
      }),
      getRequestsById: build.query<
        GetRequestsByIdApiResponse,
        GetRequestsByIdApiArg
      >({
        query: queryArg => ({
          url: `/requests/${queryArg.id}`,
          headers: { userId: queryArg.userId },
        }),
        providesTags: ["Contact"],
      }),
      postRequestsById: build.mutation<
        PostRequestsByIdApiResponse,
        PostRequestsByIdApiArg
      >({
        query: queryArg => ({
          url: `/requests/${queryArg.id}`,
          method: "POST",
          body: queryArg.contactDetail,
          headers: { userId: queryArg.userId },
        }),
        invalidatesTags: ["Contact"],
      }),
      getSubscriptions: build.query<
        GetSubscriptionsApiResponse,
        GetSubscriptionsApiArg
      >({
        query: queryArg => ({
          url: `/subscriptions`,
          headers: { userId: queryArg.userId },
        }),
        providesTags: ["Contact"],
      }),
      getSubscriptionsByEmail: build.query<
        GetSubscriptionsByEmailApiResponse,
        GetSubscriptionsByEmailApiArg
      >({
        query: queryArg => ({
          url: `/subscriptions/${queryArg.email}`,
          headers: { userId: queryArg.userId },
        }),
        providesTags: ["Contact"],
      }),
      subscribe: build.mutation<SubscribeApiResponse, SubscribeApiArg>({
        query: queryArg => ({
          url: `/subscriptions/${queryArg.email}`,
          method: "POST",
          body: queryArg.contactDetail,
          headers: { userId: queryArg.userId },
        }),
        invalidatesTags: ["Contact"],
      }),
      unsubscribe: build.mutation<UnsubscribeApiResponse, UnsubscribeApiArg>({
        query: queryArg => ({
          url: `/subscriptions/${queryArg.email}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Contact"],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as contactApi };
export type GetRequestsApiResponse = /** status 200 OK */ Contact[];
export type GetRequestsApiArg = {
  /** The id of the current user sending the request */
  userId: string;
};
export type GetRequestsByIdApiResponse = /** status 200 OK */ Contact;
export type GetRequestsByIdApiArg = {
  /** The reason for the current contact request */
  id: string;
  /** The id of the current user sending the request */
  userId: string;
};
export type PostRequestsByIdApiResponse = /** status 200 OK */ {
  guid: string;
};
export type PostRequestsByIdApiArg = {
  /** The reason for the current contact request */
  id: string;
  /** The id of the current user sending the request */
  userId: string;
  contactDetail: ContactDetail;
};
export type GetSubscriptionsApiResponse = /** status 200 OK */ string[];
export type GetSubscriptionsApiArg = {
  /** The id of the current user sending the request */
  userId: string;
};
export type GetSubscriptionsByEmailApiResponse = /** status 200 OK */ boolean;
export type GetSubscriptionsByEmailApiArg = {
  /** The email of the subscription */
  email: string;
  /** The id of the current user sending the request */
  userId: string;
};
export type SubscribeApiResponse = /** status 200 OK */ UpdateSuccessResponse;
export type SubscribeApiArg = {
  /** The email of the subscription */
  email: string;
  /** The id of the current user sending the request */
  userId: string;
  contactDetail: ContactDetail;
};
export type UnsubscribeApiResponse = /** status 200 OK */ UpdateSuccessResponse;
export type UnsubscribeApiArg = {
  /** The email of the subscription */
  email: string;
};
export type Guid = string;
export type ContactDetail = {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email: string;
  companyName?: string;
  title?: string;
  reason: "business" | "question" | "other" | "project" | "interest";
  details?: string;
  url?: string;
  isSubscribed: boolean;
} & {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  countryCode?: string;
  postalCode?: string;
};
export type Contact = {
  guid: Guid;
  createdOn: string;
  createdBy: string;
  updatedOn?: string;
  updatedBy?: string;
} & ContactDetail;
export type ProblemDetails = {
  "type": string;
  title?: string;
  detail?: string;
  instance?: string;
};
export type UpdateSuccessResponse = {
  guid: string;
};
export const {
  useGetRequestsQuery,
  useLazyGetRequestsQuery,
  useGetRequestsByIdQuery,
  useLazyGetRequestsByIdQuery,
  usePostRequestsByIdMutation,
  useGetSubscriptionsQuery,
  useLazyGetSubscriptionsQuery,
  useGetSubscriptionsByEmailQuery,
  useLazyGetSubscriptionsByEmailQuery,
  useSubscribeMutation,
  useUnsubscribeMutation,
} = injectedRtkApi;
