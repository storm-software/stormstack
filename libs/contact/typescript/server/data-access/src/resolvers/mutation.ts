/*import { getUniqueId } from "@open-system/core-shared-utilities";
import { Transaction } from "kysely";
import { builder } from "../builder";
import { DB } from "../db/types";
import { ContactApiServerContext } from "../types";
//import { ContactReasonTypes } from "@open-system/contact-shared-data-access/types";

export const CreateContactAttachment = builder.inputType(
  "CreateContactAttachment",
  {
    fields: t => ({
      name: t.string({ required: true }),
      path: t.string({ required: true }),
      status: t.string({ required: false }),
    }),
  }
);

export const CreateContact = builder.inputType("CreateContact", {
  fields: t => ({
    reason: t.string({ required: true }),
    details: t.string({ required: false }),
    firstName: t.string({ required: false }),
    lastName: t.string({ required: false }),
    email: t.string({ required: true }),
    subscribed: t.boolean({ required: true }),
    phoneNumber: t.field({ type: "PhoneNumber", required: false }),
    addressLine1: t.string({ required: false }),
    addressLine2: t.string({ required: false }),
    postalCode: t.field({ type: "PostalCode", required: false }),
    city: t.string({ required: false }),
    state: t.string({ required: false }),
    countryCode: t.field({ type: "CountryCode", required: false }),
    title: t.string({ required: false }),
    companyName: t.string({ required: false }),
    url: t.field({ type: "URL", required: false }),
    attachments: t.field({ type: [CreateContactAttachment], required: false }),
  }),
});

export const CreateContactResponse = builder.simpleObject(
  "CreateContactResponse",
  {
    fields: t => ({
      id: t.id({ nullable: false }),
    }),
  }
);

export const SubscribeEmail = builder.inputType("SubscribeEmail", {
  fields: t => ({
    details: t.string({ required: false }),
    email: t.string({ required: true }),
    subscribed: t.boolean({ required: true }),
  }),
});

builder.mutationType({
  fields: t => ({
    createContact: t.field({
      type: CreateContactResponse,
      args: {
        input: t.arg({
          type: CreateContact,
          required: true,
        }),
      },
      resolve: async (parent, args, context: ContactApiServerContext) => {
        if (!context.database) {
          throw new Error("Database not found on context.");
        }

        const result = await context.database
          .transaction()
          .execute(async (trx: Transaction<DB>) => {
            const emailAddress = {
              id: getUniqueId(),
              createdAt: new Date().toISOString(),
              updatedAt: null,
              email: args.input.email,
              subscribed: args.input.subscribed !== false ? 1 : 0,
            };
            const returnedEmailAddress = await trx
              .insertInto("EmailAddress")
              .values(emailAddress)
              .onConflict(oc => oc.column("email").doUpdateSet(emailAddress))
              .returningAll()
              .executeTakeFirstOrThrow();

            const contact = {
              id: getUniqueId(),
              createdAt: new Date().toISOString(),
              updatedAt: null,
              reason: args.input.reason,
              details: args.input.details,
              emailId: returnedEmailAddress.id,
              firstName: args.input.firstName,
              lastName: args.input.lastName,
              phoneNumber: args.input.phoneNumber,
              addressLine1: args.input.addressLine1,
              addressLine2: args.input.addressLine2,
              city: args.input.city,
              state: args.input.state,
              countryCode: args.input.countryCode,
              title: args.input.title,
              companyName: args.input.companyName,
              url: args.input.url,
            };
            const returnedContact = await trx
              .insertInto("Contact")
              .values(contact)
              .onConflict(oc => oc.column("id").doUpdateSet(contact))
              .returningAll()
              .executeTakeFirstOrThrow();

            if (args.input.attachments && args.input.attachments.length > 0) {
              const promises = args.input.attachments.map(
                (attachmentInput: any) => {
                  const attachment = {
                    id: getUniqueId(),
                    name: attachmentInput.name,
                    path: attachmentInput.path,
                    status: attachmentInput.status ?? "PENDING",
                    contactId: returnedContact.id,
                  };

                  return trx
                    .insertInto("Attachment")
                    .values(attachment)
                    .onConflict(oc => oc.column("id").doUpdateSet(attachment))
                    .returningAll()
                    .executeTakeFirstOrThrow();
                }
              );

              await Promise.all(promises);
            }

            return returnedContact;
          });

        return { id: result.id };
      },
    }),

    subscribeEmail: t.field({
      type: CreateContactResponse,
      args: {
        input: t.arg({
          type: SubscribeEmail,
          required: true,
        }),
      },
      resolve: async (parent, args, context: ContactApiServerContext) => {
        if (!context.database) {
          throw new Error("Database not found on context.");
        }

        const result = await context.database
          .transaction()
          .execute(async (trx: Transaction<DB>) => {
            const emailAddress = {
              id: getUniqueId(),
              createdAt: new Date().toISOString(),
              updatedAt: null,
              email: args.input.email,
              subscribed: args.input.subscribed !== false ? 1 : 0,
            };
            const returnedEmailAddress = await trx
              .insertInto("EmailAddress")
              .values(emailAddress)
              .onConflict(oc => oc.column("email").doUpdateSet(emailAddress))
              .returningAll()
              .executeTakeFirstOrThrow();

            const contact = {
              id: getUniqueId(),
              createdAt: new Date().toISOString(),
              updatedAt: null,
              reason: "subscription",
              emailId: returnedEmailAddress.id,
              details: args.input.details,
            };
            const returnedContact = await trx
              .insertInto("Contact")
              .values(contact)
              .onConflict(oc => oc.column("id").doUpdateSet(contact))
              .returningAll()
              .executeTakeFirstOrThrow();

            return returnedContact;
          });

        return { id: result.id };
      },
    }),
  }),
});
*/
/*builder.mutationField("createContact", t =>
  t.field({
    type: CreateContactResponse,
    args: {
      input: t.arg({
        type: CreateContact,
        required: true,
      }),
    },
    resolve: async (parent, args, context: ContactApiServerContext) => {
      /*if (!context.database) {
        throw new Error("Database not found on context.");
      }

      const result = await context.database
        .transaction()
        .execute(async (trx: Transaction<DB>) => {
          const emailAddress = {
            id: getUniqueId(),
            createdAt: new Date().toISOString(),
            updatedAt: null,
            email: args.input.email,
            subscribed: args.input.subscribed !== false ? 1 : 0,
          };
          const returnedEmailAddress = await trx
            .insertInto("EmailAddress")
            .values(emailAddress)
            .onConflict(oc => oc.column("email").doUpdateSet(emailAddress))
            .returningAll()
            .executeTakeFirstOrThrow();

          const contact = {
            id: getUniqueId(),
            createdAt: new Date().toISOString(),
            updatedAt: null,
            reason: args.input.reason,
            emailId: returnedEmailAddress.id,
            firstName: args.input.firstName,
            lastName: args.input.lastName,
            phoneNumber: args.input.phoneNumber,
            addressLine1: args.input.addressLine1,
            addressLine2: args.input.addressLine2,
            city: args.input.city,
            state: args.input.state,
            countryCode: args.input.countryCode,
            title: args.input.title,
            companyName: args.input.companyName,
            url: args.input.url,
          };
          const returnedContact = await trx
            .insertInto("Contact")
            .values(contact)
            .onConflict(oc => oc.column("id").doUpdateSet(contact))
            .returningAll()
            .executeTakeFirstOrThrow();

          if (args.input.attachments && args.input.attachments.length > 0) {
            const promises = args.input.attachments.map(
              (attachmentInput: any) => {
                const attachment = {
                  id: getUniqueId(),
                  name: attachmentInput.name,
                  path: attachmentInput.path,
                  status: attachmentInput.status ?? "PENDING",
                  contactId: returnedContact.id,
                };

                return trx
                  .insertInto("Attachment")
                  .values(attachment)
                  .onConflict(oc => oc.column("id").doUpdateSet(attachment))
                  .returningAll()
                  .executeTakeFirstOrThrow();
              }
            );

            await Promise.all(promises);
          }

          return returnedContact;
        });*/

/* return { id: getUniqueId() };
    },
  })
);
*/
