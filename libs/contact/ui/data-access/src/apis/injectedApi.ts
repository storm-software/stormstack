import {
  HttpHandler,
  ResponseContext,
} from "@open-system/core-typescript-utilities";
import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";
import { apiSlice as api } from "./apiSlice";

import {
  CommandSuccessResponse,
  ContactHeaderRecord,
  ContactRecord,
  CreateContactRequest,
  GetContactDetails200Response,
  GetContacts200Response,
  GetSubscriptions200Response,
} from "../models";

import {
  ContactApiRequestFactory,
  ContactApiResponseProcessor,
} from "../parsers/ContactApiParser";

export interface ContactApiCreateContactRequest {
  /**
   *
   * @type CreateContactRequest
   * @memberof ContactApicreateContact
   */
  body?: CreateContactRequest;
}

export interface ContactApiCreateContactDetailRequest {
  /**
   * The records guid
   * @type string
   * @memberof ContactApicreateContactDetail
   */
  id?: string;
}

export interface ContactApiGetContactByIdRequest {
  /**
   * The records guid
   * @type string
   * @memberof ContactApigetContactById
   */
  id?: string;
}

export interface ContactApiGetContactDetailsRequest {
  /**
   * The records guid
   * @type string
   * @memberof ContactApigetContactDetails
   */
  id?: string;
  /**
   * The current page number of the selected data
   * @type number
   * @memberof ContactApigetContactDetails
   */
  pageNumber?: number;
  /**
   * The maximum amount of data to return in one request
   * @type number
   * @memberof ContactApigetContactDetails
   */
  pageSize?: number;
  /**
   * The field to filter data by
   * @type string
   * @memberof ContactApigetContactDetails
   */
  orderBy?: string;
  /**
   * An reason type value to filter the returned contact details
   * @type &#39;business&#39; | &#39;question&#39; | &#39;other&#39; | &#39;project&#39; | &#39;interest&#39;
   * @memberof ContactApigetContactDetails
   */
  reason?: "business" | "question" | "other" | "project" | "interest";
}

export interface ContactApiGetContactsRequest {
  /**
   * The current page number of the selected data
   * @type number
   * @memberof ContactApigetContacts
   */
  pageNumber?: number;
  /**
   * The maximum amount of data to return in one request
   * @type number
   * @memberof ContactApigetContacts
   */
  pageSize?: number;
  /**
   * The field to order the records by
   * @type string
   * @memberof ContactApigetContacts
   */
  orderBy?: string;
  /**
   * An email value to filter the returned contacts
   * @type string
   * @memberof ContactApigetContacts
   */
  email?: string;
  /**
   * A first name value to filter the returned contacts
   * @type string
   * @memberof ContactApigetContacts
   */
  firstName?: string;
  /**
   * A last name value to filter the returned contacts
   * @type string
   * @memberof ContactApigetContacts
   */
  lastName?: string;
}

export interface ContactApiGetSubscriptionByEmailRequest {
  /**
   * The email of the subscription
   * @type string
   * @memberof ContactApigetSubscriptionByEmail
   */
  email?: string;
}

export interface ContactApiGetSubscriptionsRequest {
  /**
   * The current page number of the selected data
   * @type number
   * @memberof ContactApigetSubscriptions
   */
  pageNumber?: number;
  /**
   * The maximum amount of data to return in one request
   * @type number
   * @memberof ContactApigetSubscriptions
   */
  pageSize?: number;
  /**
   * The field to order the data by
   * @type string
   * @memberof ContactApigetSubscriptions
   */
  orderBy?: string;
}

export interface ContactApiSubscribeRequest {
  /**
   * The email of the subscription
   * @type string
   * @memberof ContactApisubscribe
   */
  email?: string;
}

export interface ContactApiUnsubscribeRequest {
  /**
   * The email of the subscription
   * @type string
   * @memberof ContactApiunsubscribe
   */
  email?: string;
}

export interface ContactApiUpdateContactRequest {
  /**
   * The records guid
   * @type string
   * @memberof ContactApiupdateContact
   */
  id?: string;
  /**
   *
   * @type ContactHeaderRecord
   * @memberof ContactApiupdateContact
   */
  body?: ContactHeaderRecord;
}

export const addTagTypes = ["Contact"] as const;
export const contactApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (
      build: EndpointBuilder<HttpHandler, "Contact", "contactApi">
    ) => ({
      createContact: build.mutation<
        CommandSuccessResponse,
        ContactApiCreateContactRequest
      >({
        query: queryArg => ContactApiRequestFactory.createContact(queryArg),
        invalidatesTags: ["Contact"],
        transformResponse: async (
          responseContext: ResponseContext<CommandSuccessResponse>,
          meta: any,
          arg: any
        ): Promise<CommandSuccessResponse> =>
          await ContactApiResponseProcessor.createContact(responseContext),
      }),
      createContactDetail: build.mutation<
        CommandSuccessResponse,
        ContactApiCreateContactDetailRequest
      >({
        query: queryArg =>
          ContactApiRequestFactory.createContactDetail(queryArg),
        invalidatesTags: ["Contact"],
        transformResponse: async (
          responseContext: ResponseContext<CommandSuccessResponse>,
          meta: any,
          arg: any
        ): Promise<CommandSuccessResponse> =>
          await ContactApiResponseProcessor.createContactDetail(
            responseContext
          ),
      }),
      getContactById: build.query<
        ContactRecord,
        ContactApiGetContactByIdRequest
      >({
        query: queryArg => ContactApiRequestFactory.getContactById(queryArg),
        providesTags: ["Contact"],
        transformResponse: async (
          responseContext: ResponseContext<ContactRecord>,
          meta: any,
          arg: any
        ): Promise<ContactRecord> =>
          await ContactApiResponseProcessor.getContactById(responseContext),
      }),
      getContactDetails: build.query<
        GetContactDetails200Response,
        ContactApiGetContactDetailsRequest
      >({
        query: queryArg => ContactApiRequestFactory.getContactDetails(queryArg),
        providesTags: ["Contact"],
        transformResponse: async (
          responseContext: ResponseContext<GetContactDetails200Response>,
          meta: any,
          arg: any
        ): Promise<GetContactDetails200Response> =>
          await ContactApiResponseProcessor.getContactDetails(responseContext),
      }),
      getContacts: build.query<
        GetContacts200Response,
        ContactApiGetContactsRequest
      >({
        query: queryArg => ContactApiRequestFactory.getContacts(queryArg),
        providesTags: ["Contact"],
        transformResponse: async (
          responseContext: ResponseContext<GetContacts200Response>,
          meta: any,
          arg: any
        ): Promise<GetContacts200Response> =>
          await ContactApiResponseProcessor.getContacts(responseContext),
      }),
      getSubscriptionByEmail: build.query<
        boolean,
        ContactApiGetSubscriptionByEmailRequest
      >({
        query: queryArg =>
          ContactApiRequestFactory.getSubscriptionByEmail(queryArg),
        providesTags: ["Contact"],
        transformResponse: async (
          responseContext: ResponseContext<boolean>,
          meta: any,
          arg: any
        ): Promise<boolean> =>
          await ContactApiResponseProcessor.getSubscriptionByEmail(
            responseContext
          ),
      }),
      getSubscriptions: build.query<
        GetSubscriptions200Response,
        ContactApiGetSubscriptionsRequest
      >({
        query: queryArg => ContactApiRequestFactory.getSubscriptions(queryArg),
        providesTags: ["Contact"],
        transformResponse: async (
          responseContext: ResponseContext<GetSubscriptions200Response>,
          meta: any,
          arg: any
        ): Promise<GetSubscriptions200Response> =>
          await ContactApiResponseProcessor.getSubscriptions(responseContext),
      }),
      subscribe: build.mutation<
        CommandSuccessResponse,
        ContactApiSubscribeRequest
      >({
        query: queryArg => ContactApiRequestFactory.subscribe(queryArg),
        invalidatesTags: ["Contact"],
        transformResponse: async (
          responseContext: ResponseContext<CommandSuccessResponse>,
          meta: any,
          arg: any
        ): Promise<CommandSuccessResponse> =>
          await ContactApiResponseProcessor.subscribe(responseContext),
      }),
      unsubscribe: build.mutation<
        CommandSuccessResponse,
        ContactApiUnsubscribeRequest
      >({
        query: queryArg => ContactApiRequestFactory.unsubscribe(queryArg),
        invalidatesTags: ["Contact"],
        transformResponse: async (
          responseContext: ResponseContext<CommandSuccessResponse>,
          meta: any,
          arg: any
        ): Promise<CommandSuccessResponse> =>
          await ContactApiResponseProcessor.unsubscribe(responseContext),
      }),
      updateContact: build.mutation<
        CommandSuccessResponse,
        ContactApiUpdateContactRequest
      >({
        query: queryArg => ContactApiRequestFactory.updateContact(queryArg),
        invalidatesTags: ["Contact"],
        transformResponse: async (
          responseContext: ResponseContext<CommandSuccessResponse>,
          meta: any,
          arg: any
        ): Promise<CommandSuccessResponse> =>
          await ContactApiResponseProcessor.updateContact(responseContext),
      }),
    }),
    overrideExisting: false,
  });

export const {
  useCreateContactMutation,
  useCreateContactDetailMutation,
  useGetContactByIdQuery,
  useLazyGetContactByIdQuery,
  useGetContactDetailsQuery,
  useLazyGetContactDetailsQuery,
  useGetContactsQuery,
  useLazyGetContactsQuery,
  useGetSubscriptionByEmailQuery,
  useLazyGetSubscriptionByEmailQuery,
  useGetSubscriptionsQuery,
  useLazyGetSubscriptionsQuery,
  useSubscribeMutation,
  useUnsubscribeMutation,
  useUpdateContactMutation,
} = contactApi;
