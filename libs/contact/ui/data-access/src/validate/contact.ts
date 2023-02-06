/* eslint-disable */
/* prettier-ignore */
import Joi from "joi"

export const schemas = {
  parameters: {
    "get-contact-requests": {
      path: Joi.object({}),
      query: Joi.object({}),
      header: Joi.object({
        "userId": Joi.string().allow("").required().min(0),
      }),
      cookie: Joi.object({}),
      responses: Joi.object({}),
      requestBody: Joi.object({}),
    },
    "get-contact-request": {
      path: Joi.object({}),
      query: Joi.object({}),
      header: Joi.object({
        "userId": Joi.string().allow("").required().min(0),
      }),
      cookie: Joi.object({}),
      responses: Joi.object({}),
      requestBody: Joi.object({}),
    },
    "add-contact-request": {
      path: Joi.object({}),
      query: Joi.object({}),
      header: Joi.object({
        "userId": Joi.string().allow("").required().min(0),
      }),
      cookie: Joi.object({}),
      responses: Joi.object({}),
      requestBody: Joi.object({}),
    },
    "get-subscriptions": {
      path: Joi.object({}),
      query: Joi.object({}),
      header: Joi.object({
        "userId": Joi.string().allow("").required().min(0),
      }),
      cookie: Joi.object({}),
      responses: Joi.object({}),
      requestBody: Joi.object({}),
    },
    "get-subscription": {
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
        Joi.object({}).unknown(),
        Joi.alternatives()
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
            Joi.object({
              "firstName": Joi.string().allow("").min(0),
              "lastName": Joi.string().allow("").min(0),
              "phoneNumber": Joi.string().allow("").min(0),
              "email": Joi.string()
                .description("The email address of the contact")
                .required()
                .email({}),
              "reason": Joi.string()
                .allow("business", "question", "other", "project", "interest")
                .default("business")
                .description("The type of contact request")
                .only(),
              "details": Joi.string().allow("").min(0),
              "url": Joi.string().uri({}),
              "isSubscribed": Joi.boolean().default(true).required(),
            })
              .description("The base model for contact data")
              .label("ContactDetail")
              .unknown()
          )
      ),
    "ContactDetail": Joi.object({
      "firstName": Joi.string().allow("").min(0),
      "lastName": Joi.string().allow("").min(0),
      "phoneNumber": Joi.string().allow("").min(0),
      "email": Joi.string()
        .description("The email address of the contact")
        .required()
        .email({}),
      "reason": Joi.string()
        .allow("business", "question", "other", "project", "interest")
        .default("business")
        .description("The type of contact request")
        .only(),
      "details": Joi.string().allow("").min(0),
      "url": Joi.string().uri({}),
      "isSubscribed": Joi.boolean().default(true).required(),
    })
      .description("The base model for contact data")
      .label("ContactDetail")
      .unknown(),
  },
};
