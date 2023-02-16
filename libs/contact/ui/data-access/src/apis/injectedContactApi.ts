import { contactApi as api } from "../state/contactApi";
export const addTagTypes = ["Contact"] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: build => ({
      getContacts: build.query<GetContactsApiResponse, GetContactsApiArg>({
        query: queryArg => ({
          url: `/contacts`,
          headers: { userId: queryArg.userId },
          params: {
            email: queryArg.email,
            firstName: queryArg.firstName,
            lastName: queryArg.lastName,
          },
        }),
        providesTags: ["Contact"],
      }),
      addContact: build.mutation<AddContactApiResponse, AddContactApiArg>({
        query: queryArg => ({
          url: `/contacts`,
          method: "POST",
          body: queryArg.body,
          headers: { userId: queryArg.userId },
        }),
        invalidatesTags: ["Contact"],
      }),
      getContact: build.query<GetContactApiResponse, GetContactApiArg>({
        query: queryArg => ({
          url: `/contacts/${queryArg.guid}`,
          headers: { userId: queryArg.userId },
        }),
        providesTags: ["Contact"],
      }),
      updateContact: build.mutation<
        UpdateContactApiResponse,
        UpdateContactApiArg
      >({
        query: queryArg => ({
          url: `/contacts/${queryArg.guid}`,
          method: "PUT",
          body: queryArg.contactHeader,
          headers: { userId: queryArg.userId },
        }),
        invalidatesTags: ["Contact"],
      }),
      getContactDetails: build.query<
        GetContactDetailsApiResponse,
        GetContactDetailsApiArg
      >({
        query: queryArg => ({
          url: `/contacts/${queryArg.guid}/details`,
          headers: { userId: queryArg.userId },
          params: { reason: queryArg.reason },
        }),
        providesTags: ["Contact"],
      }),
      addContactDetail: build.mutation<
        AddContactDetailApiResponse,
        AddContactDetailApiArg
      >({
        query: queryArg => ({
          url: `/contacts/${queryArg.guid}/details`,
          method: "POST",
          headers: { userId: queryArg.userId },
        }),
        invalidatesTags: ["Contact"],
      }),
      getSubscriptions: build.query<
        GetSubscriptionsApiResponse,
        GetSubscriptionsApiArg
      >({
        query: queryArg => ({
          url: `/contacts/subscriptions`,
          headers: { userId: queryArg.userId },
        }),
        providesTags: ["Contact"],
      }),
      getSubscription: build.query<
        GetSubscriptionApiResponse,
        GetSubscriptionApiArg
      >({
        query: queryArg => ({
          url: `/contacts/subscriptions/${queryArg.email}`,
          headers: { userId: queryArg.userId },
        }),
        providesTags: ["Contact"],
      }),
      subscribe: build.mutation<SubscribeApiResponse, SubscribeApiArg>({
        query: queryArg => ({
          url: `/contacts/subscriptions/${queryArg.email}`,
          method: "POST",
          body: queryArg.body,
          headers: { userId: queryArg.userId },
        }),
        invalidatesTags: ["Contact"],
      }),
      unsubscribe: build.mutation<UnsubscribeApiResponse, UnsubscribeApiArg>({
        query: queryArg => ({
          url: `/contacts/subscriptions/${queryArg.email}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Contact"],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as injectedContactApi };
export type GetContactsApiResponse = /** status 200 OK */ Contact[];
export type GetContactsApiArg = {
  /** The id of the current user sending the request */
  userId: string;
  /** An email value to filter the returned contacts  */
  email?: string;
  /** A first name value to filter the returned contacts  */
  firstName?: string;
  /** A last name value to filter the returned contacts  */
  lastName?: string;
};
export type AddContactApiResponse = /** status 200 OK */ {
  guid: string;
};
export type AddContactApiArg = {
  /** User Id sending request */
  userId: string;
  body: ContactHeader & ContactDetail;
};
export type GetContactApiResponse = /** status 200 OK */ Contact;
export type GetContactApiArg = {
  /** The records guid */
  guid: string;
  /** The id of the current user sending the request */
  userId: string;
};
export type UpdateContactApiResponse =
  /** status 200 OK */ UpdateSuccessResponse;
export type UpdateContactApiArg = {
  /** The records guid */
  guid: string;
  /** User Id sending request */
  userId: string;
  contactHeader: ContactHeader;
};
export type GetContactDetailsApiResponse = /** status 200 OK */ ContactDetail[];
export type GetContactDetailsApiArg = {
  /** The records guid */
  guid: string;
  /** The id of the current user sending the request */
  userId: string;
  /** An reason type value to filter the returned contact details  */
  reason?: "business" | "question" | "other" | "project" | "interest";
};
export type AddContactDetailApiResponse =
  /** status 200 OK */ UpdateSuccessResponse;
export type AddContactDetailApiArg = {
  /** The records guid */
  guid: string;
  /** User Id sending request */
  userId: string;
};
export type GetSubscriptionsApiResponse = /** status 200 OK */ string[];
export type GetSubscriptionsApiArg = {
  /** The id of the current user sending the request */
  userId: string;
};
export type GetSubscriptionApiResponse = /** status 200 OK */ boolean;
export type GetSubscriptionApiArg = {
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
  body: ContactHeader & ContactDetail;
};
export type UnsubscribeApiResponse = /** status 200 OK */ UpdateSuccessResponse;
export type UnsubscribeApiArg = {
  /** The email of the subscription */
  email: string;
};
export type Guid = string;
export type ContactHeader = {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email: string;
  isSubscribed: boolean;
} & {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  countryCode?: string;
  postalCode?: string;
};
export type ContactDetail = {
  companyName?: string;
  title?: string;
  reason: "business" | "question" | "other" | "project" | "interest";
  details?: string;
  url?: string;
};
export type Contact = {
  guid: Guid;
  createdOn: string;
  createdBy: string;
  updatedOn?: string;
  updatedBy?: string;
} & ContactHeader &
  ContactDetail[];
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
  useGetContactsQuery,
  useLazyGetContactsQuery,
  useAddContactMutation,
  useGetContactQuery,
  useLazyGetContactQuery,
  useUpdateContactMutation,
  useGetContactDetailsQuery,
  useLazyGetContactDetailsQuery,
  useAddContactDetailMutation,
  useGetSubscriptionsQuery,
  useLazyGetSubscriptionsQuery,
  useGetSubscriptionQuery,
  useLazyGetSubscriptionQuery,
  useSubscribeMutation,
  useUnsubscribeMutation,
} = injectedRtkApi;
