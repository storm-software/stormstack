/*import { resolveWindowedConnection } from "@open-system/core-server-data-access";
import { builder } from "../builder";
import { ContactTableModel, EmailAddressTableModel } from "../models";
import { ContactApiServerContext } from "../types";

export const QueryType = builder.queryType({
  fields: t => ({
    emailAddress: t.field({
      type: EmailAddressTableModel,
      nullable: true,
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: async (root, args, context: ContactApiServerContext) => {
        const emailAddress = await context.database
          .selectFrom("EmailAddress")
          .where("id", "=", String(args.id))
          .selectAll()
          .executeTakeFirstOrThrow();

        return { ...emailAddress, __typename: "EmailAddress" };
      },
    }),
    emailAddresses: t.connection({
      type: EmailAddressTableModel,
      resolve: async (root, args, context: ContactApiServerContext) =>
        resolveWindowedConnection({ args }, async ({ limit, offset }) => {
          const emailAddresses = (
            await context.database
              .selectFrom("EmailAddress")
              .selectAll()
              .where("EmailAddress.id", "=", String(args.id))
              .execute()
          ).map(emailAddress => ({
            ...emailAddress,
            __typename: "EmailAddress",
          }));

          return {
            items: emailAddresses.slice(offset, offset + limit),
            totalCount: emailAddresses.length,
          };
        }),
    }),
    contact: t.field({
      type: ContactTableModel,
      nullable: true,
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: async (root, args, context: ContactApiServerContext) => {
        const contact = await context.database
          .selectFrom("Contact")
          .selectAll()
          .where("Contact.id", "=", String(args.id))
          .executeTakeFirstOrThrow();

        return { ...contact, __typename: "Contact" };
      },
    }),
  }),
});*/

/* eslint-disable @typescript-eslint/no-explicit-any */
/*import { jsonArrayFrom } from "kysely/helpers/postgres";
import { builder } from "../builder";
import {
  AttachmentResponseType,
  ContactResponseType,
  SubscribedResponseType,
} from "../models";
import { ContactApiServerContext } from "../types";

builder.queryField("contacts", t =>
  t.field({
    type: [ContactResponseType],
    resolve: async (parent, args, context: ContactApiServerContext) => {
      return await context.database
        .selectFrom("Contact")
        .selectAll()
        .innerJoin("EmailAddress", "EmailAddress.id", "Contact.emailId")
        .select(["EmailAddress.email", "EmailAddress.subscribed"])
        .select((eb: any) =>
          jsonArrayFrom(
            eb
              .selectFrom("Attachment")
              .select([
                "Attachment.id",
                "Attachment.createdAt",
                "Attachment.updatedAt",
                "Attachment.name",
                "Attachment.path",
                "Attachment.status",
              ])
              .whereRef("Attachment.contactId", "=", "Contact.id")
              .orderBy("Attachment.name")
          ).as("attachments")
        )
        .execute();
    },
  })
);

builder.queryField("contactById", t =>
  t.field({
    type: ContactResponseType,
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (parent, args, context: ContactApiServerContext) => {
      return await context.database
        .selectFrom("Contact")
        .selectAll()
        .where("Contact.id", "=", args.id)
        .innerJoin("EmailAddress", "EmailAddress.id", "Contact.emailId")
        .select(["EmailAddress.email", "EmailAddress.subscribed"])
        .select((eb: any) =>
          jsonArrayFrom(
            eb
              .selectFrom("Attachment")
              .select([
                "Attachment.id",
                "Attachment.createdAt",
                "Attachment.updatedAt",
                "Attachment.name",
                "Attachment.path",
                "Attachment.status",
              ])
              .whereRef("Attachment.contactId", "=", "Contact.id")
              .orderBy("Attachment.name")
          ).as("attachments")
        )
        .executeTakeFirstOrThrow();
    },
  })
);

builder.queryField("contactByEmail", t =>
  t.field({
    type: ContactResponseType,
    args: {
      email: t.arg.string({ required: true }),
    },
    resolve: async (parent, args, context: ContactApiServerContext) => {
      return await context.database
        .selectFrom("Contact")
        .selectAll()
        .innerJoin("EmailAddress", "EmailAddress.id", "Contact.emailId")
        .select(["EmailAddress.email", "EmailAddress.subscribed"])
        .where("EmailAddress.email", "=", args.email)
        .select((eb: any) =>
          jsonArrayFrom(
            eb
              .selectFrom("Attachment")
              .select([
                "Attachment.id",
                "Attachment.createdAt",
                "Attachment.updatedAt",
                "Attachment.name",
                "Attachment.path",
                "Attachment.status",
              ])
              .whereRef("Attachment.contactId", "=", "Contact.id")
              .orderBy("Attachment.name")
          ).as("attachments")
        )
        .executeTakeFirstOrThrow();
    },
  })
);

builder.queryField("attachmentsByContactId", t =>
  t.field({
    type: [AttachmentResponseType],
    args: {
      contactId: t.arg.string({ required: true }),
    },
    resolve: async (parent, args, context: ContactApiServerContext) => {
      return await context.database
        .selectFrom("Attachment")
        .select([
          "Attachment.id",
          "Attachment.createdAt",
          "Attachment.updatedAt",
          "Attachment.name",
          "Attachment.path",
          "Attachment.status",
        ])
        .where("Attachment.contactId", "=", args.contactId)
        .orderBy("Attachment.name")
        .execute();
    },
  })
);

builder.queryField("subscribed", t =>
  t.field({
    type: [SubscribedResponseType],
    resolve: async (parent, args, context: ContactApiServerContext) => {
      return await context.database
        .selectFrom("EmailAddress")
        .where("EmailAddress.subscribed", ">", 0)
        .select(["email", "id"])
        .orderBy("email")
        .execute();
    },
  })
);
*/
