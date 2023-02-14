"use client";

/* eslint-disable */
/* prettier-ignore */

import Joi from "joi";

export const contactSchemas = {
  parameters: {
    "getContacts": {
      path: Joi.object({}),
      query: Joi.object({
        "email": Joi.string()
          .optional(),
        "firstName": Joi.string().allow("").optional().max(50).min(0),
        "lastName": Joi.string().allow("").optional().min(0),
      }),
      header: Joi.object({
        "userId": Joi.string().allow("").required().min(0),
      }),
      cookie: Joi.object({}),
      responses: Joi.object({}),
      requestBody: Joi.object({}),
    },
    "addContact": {
      path: Joi.object({}),
      query: Joi.object({}),
      header: Joi.object({
        "userId": Joi.string().allow("").required().min(0),
      }),
      cookie: Joi.object({}),
      responses: Joi.object({}),
      requestBody: Joi.object({}),
    },
    "getContact": {
      path: Joi.object({}),
      query: Joi.object({}),
      header: Joi.object({
        "userId": Joi.string().allow("").required().min(0),
      }),
      cookie: Joi.object({}),
      responses: Joi.object({}),
      requestBody: Joi.object({}),
    },
    "updateContact": {
      path: Joi.object({}),
      query: Joi.object({}),
      header: Joi.object({
        "userId": Joi.string().allow("").required().min(0),
      }),
      cookie: Joi.object({}),
      responses: Joi.object({}),
      requestBody: Joi.object({}),
    },
    "getContactDetails": {
      path: Joi.object({}),
      query: Joi.object({
        "reason": Joi.string()
          .allow("business", "question", "other", "project", "interest")
          .only()
          .optional(),
      }),
      header: Joi.object({
        "userId": Joi.string().allow("").required().min(0),
      }),
      cookie: Joi.object({}),
      responses: Joi.object({}),
      requestBody: Joi.object({}),
    },
    "addContactDetail": {
      path: Joi.object({}),
      query: Joi.object({}),
      header: Joi.object({
        "userId": Joi.string().allow("").required().min(0),
      }),
      cookie: Joi.object({}),
      responses: Joi.object({}),
      requestBody: Joi.object({}),
    },
    "getSubscriptions": {
      path: Joi.object({}),
      query: Joi.object({}),
      header: Joi.object({
        "userId": Joi.string().allow("").required().min(0),
      }),
      cookie: Joi.object({}),
      responses: Joi.object({}),
      requestBody: Joi.object({}),
    },
    "getSubscription": {
      path: Joi.object({}),
      query: Joi.object({}),
      header: Joi.object({
        "userId": Joi.string().allow("").required().min(0),
      }),
      cookie: Joi.object({}),
      responses: Joi.object({}),
      requestBody: Joi.object({}),
    },
    "subscribe": {
      path: Joi.object({}),
      query: Joi.object({}),
      header: Joi.object({
        "userId": Joi.string().allow("").required().min(0),
      }),
      cookie: Joi.object({}),
      responses: Joi.object({}),
      requestBody: Joi.object({}),
    },
  },
  components: {
    "Contact": Joi.alternatives()
      .match("all")
      .try(
        Joi.object({
          "guid": Joi.string()
            .description("The `guid` associated with the record")
            .label("Guid")
            .required()
            .guid({ "version": ["uuidv4"] }),
          "createdOn": Joi.date().required(),
          "createdBy": Joi.string().allow("").required().min(0),
          "updatedOn": Joi.date(),
          "updatedBy": Joi.string().allow("").min(0),
        })
          .description(
            "The minimum model fields shared by all data stored in the database"
          )
          .label("RecordBase")
          .unknown(),
        Joi.alternatives()
          .match("all")
          .try(
            Joi.object({})
              .description(
                "Contact data used to identify an individual and attach details too."
              )
              .label("ContactHeader")
              .unknown(),
            Joi.alternatives()
              .match("all")
              .try(
                Joi.object({
                  "firstName": Joi.string().allow("").max(50).min(0),
                  "lastName": Joi.string().allow("").max(50).min(0),
                  "phoneNumber": Joi.string()
                    .pattern(
                      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
                      {}
                    )
                    .max(15)
                    .min(0),
                  "email": Joi.string()
                    .description("The email address of the contact")
                    .required(),
                  "isSubscribed": Joi.boolean().default(true).required(),
                }).unknown(),
                Joi.object({
                  "addressLine1": Joi.string().allow("").max(50).min(0),
                  "addressLine2": Joi.string().allow("").max(50).min(0),
                  "city": Joi.string().allow("").max(50).min(0),
                  "state": Joi.string().allow("").max(50).min(0),
                  "countryCode": Joi.string().allow("").max(50).min(0),
                  "postalCode": Joi.string().max(9).min(5),
                })
                  .description("Data used to specify a location")
                  .label("Address")
                  .unknown()
              )
          ),
        Joi.array().items(
          Joi.object({
            "companyName": Joi.string().allow("").max(50).min(0),
            "title": Joi.string().allow("").max(50).min(0),
            "reason": Joi.string()
              .allow("business", "question", "other", "project", "interest")
              .default("business")
              .description("The type of contact request")
              .only()
              .required(),
            "details": Joi.string().allow("").max(2000).min(0),
            "url": Joi.string().uri({}),
          })
            .description("Base data used to capture a contact request ")
            .label("ContactDetail")
            .unknown()
        )
      ),
    "ContactHeader": Joi.alternatives()
      .match("all")
      .try(
        Joi.object({})
          .description(
            "Contact data used to identify an individual and attach details too."
          )
          .label("ContactHeader")
          .unknown(),
        Joi.alternatives()
          .match("all")
          .try(
            Joi.object({
              "firstName": Joi.string().allow("").max(50).min(0),
              "lastName": Joi.string().allow("").max(50).min(0),
              "phoneNumber": Joi.string()
                .allow("")
                .pattern(
                  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
                  {}
                )
                .max(15)
                .min(0),
              "email": Joi.string()
                .description("The email address of the contact")
                .required(),
              "isSubscribed": Joi.boolean().default(true).required(),
            }).unknown(),
            Joi.object({
              "addressLine1": Joi.string().allow("").max(50).min(0),
              "addressLine2": Joi.string().allow("").max(50).min(0),
              "city": Joi.string().allow("").max(50).min(0),
              "state": Joi.string().allow("").max(50).min(0),
              "countryCode": Joi.string().allow("").max(50).min(0),
              "postalCode": Joi.string().max(9).min(5),
            })
              .description("Data used to specify a location")
              .label("Address")
              .unknown()
          )
      ),
    "ContactDetail": Joi.object({
      "companyName": Joi.string().allow("").max(50).min(0),
      "title": Joi.string().allow("").max(50).min(0),
      "reason": Joi.string()
        .allow("business", "question", "other", "project", "interest")
        .default("business")
        .description("The type of contact request")
        .only()
        .required(),
      "details": Joi.string().allow("").max(2000).min(0),
      "url": Joi.string().uri({}),
    })
      .description("Base data used to capture a contact request ")
      .label("ContactDetail")
      .unknown(),
  },
};
