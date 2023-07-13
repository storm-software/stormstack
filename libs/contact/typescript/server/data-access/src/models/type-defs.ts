/* eslint-disable @typescript-eslint/ban-types */
/*import {
  PageCursor,
  PageCursors,
  TableModel,
  resolveWindowedConnection,
} from "@open-system/core-server-data-access";
import { getUniqueId } from "@open-system/core-shared-utilities";
import { Transaction } from "kysely";
import { builder } from "../builder";
import { DB } from "../db/types";
import { ContactApiServerContext } from "../types";

const PageCursorRef = builder.objectRef<PageCursor>("PageCursor");

PageCursorRef.implement({
  fields: t => ({
    cursor: t.exposeString("cursor"),
    pageNumber: t.exposeInt("pageNumber"),
    isCurrent: t.exposeBoolean("isCurrent"),
  }),
});

const PageCursorsRef = builder.objectRef<PageCursors>("PageCursors");

PageCursorsRef.implement({
  fields: t => ({
    first: t.field({
      type: PageCursorRef,
      resolve: ({ first }) => first,
    }),
    last: t.field({
      type: PageCursorRef,
      resolve: ({ last }) => last,
    }),
    around: t.field({
      type: [PageCursorRef],
      resolve: ({ around }) => around,
    }),
  }),
});

builder.globalConnectionField("pageCursors", t =>
  t.field({
    type: PageCursorsRef,
    resolve: ({ pageCursors }: any) => pageCursors,
  })
);

export const ContactTableModel =
  builder.objectRef<TableModel<DB, "Contact">>("Contact");
export const AttachmentTableModel =
  builder.objectRef<TableModel<DB, "Attachment">>("Attachment");
export const EmailAddressTableModel =
  builder.objectRef<TableModel<DB, "EmailAddress">>("EmailAddress");

builder.node(ContactTableModel, {
  id: {
    resolve: contact => contact.id,
  },
  loadMany: async (ids, context: ContactApiServerContext) => {
    return (
      await context.database
        .selectFrom("Contact")
        .where("id", "in", ids)
        .selectAll()
        .execute()
    ).map(contact => ({ ...contact, __typename: "Contact" }));
  },
  fields: t => ({
    createdAt: t.exposeString("createdAt", { nullable: false }),
    updatedAt: t.exposeString("updatedAt", { nullable: true }),
    details: t.exposeString("details", { nullable: true }),
    reason: t.exposeString("reason", { nullable: false }),
    firstName: t.exposeString("firstName", { nullable: true }),
    lastName: t.exposeString("lastName", { nullable: true }),
    emailId: t.exposeID("emailId", { nullable: false }),
    phoneNumber: t.exposeString("phoneNumber", { nullable: true }),
    addressLine1: t.exposeString("addressLine1", { nullable: true }),
    addressLine2: t.exposeString("addressLine2", { nullable: true }),
    postalCode: t.exposeString("postalCode", { nullable: true }),
    city: t.exposeString("city", { nullable: true }),
    state: t.exposeString("state", { nullable: true }),
    countryCode: t.exposeString("countryCode", { nullable: true }),
    title: t.exposeString("title", { nullable: true }),
    companyName: t.exposeString("companyName", { nullable: true }),
    url: t.exposeString("url", { nullable: true }),
    attachments: t.connection({
      type: AttachmentTableModel,
      resolve: (contact, args, context: ContactApiServerContext) =>
        resolveWindowedConnection({ args }, async ({ limit, offset }) => {
          const attachments = (
            await context.database
              .selectFrom("Attachment")
              .selectAll()
              .where("Attachment.contactId", "=", contact.id)
              .execute()
          ).map(attachment => ({ ...attachment, __typename: "Attachment" }));

          return {
            items: attachments.slice(offset, offset + limit),
            totalCount: attachments.length,
          };
        }),
    }),
  }),
});

builder.node(EmailAddressTableModel, {
  id: {
    resolve: emailAddress => emailAddress.id,
  },
  loadMany: async (ids, context: ContactApiServerContext) => {
    return (
      await context.database
        .selectFrom("EmailAddress")
        .where("id", "in", ids)
        .selectAll()
        .execute()
    ).map(emailAddress => ({ ...emailAddress, __typename: "EmailAddress" }));
  },
  fields: t => ({
    createdAt: t.exposeString("createdAt", { nullable: false }),
    updatedAt: t.exposeString("updatedAt", { nullable: true }),
    email: t.exposeString("email", { nullable: false }),
    subscribed: t.exposeInt("subscribed", { nullable: false }),
    contacts: t.connection({
      type: ContactTableModel,
      resolve: (contact, args, context: ContactApiServerContext) =>
        resolveWindowedConnection({ args }, async ({ limit, offset }) => {
          const contacts = (
            await context.database
              .selectFrom("Contact")
              .selectAll()
              .where("Contact.id", "=", contact.id)
              .execute()
          ).map(contact => ({ ...contact, __typename: "Contact" }));

          return {
            items: contacts.slice(offset, offset + limit),
            totalCount: contacts.length,
          };
        }),
    }),
  }),
});

AttachmentTableModel.implement({
  fields: t => ({
    id: t.exposeID("id", { nullable: false }),
    createdAt: t.exposeString("createdAt", { nullable: false }),
    updatedAt: t.exposeString("updatedAt", { nullable: true }),
    name: t.exposeString("name", { nullable: false }),
    path: t.exposeString("path", { nullable: false }),
    status: t.exposeString("status", { nullable: false }),

    contact: t.field({
      type: ContactTableModel,
      nullable: true,
      resolve: async (attachment, args, context: ContactApiServerContext) => {
        const contact = await context.database
          .selectFrom("Contact")
          .selectAll()
          .where("Contact.id", "=", attachment.contactId)
          .executeTakeFirstOrThrow();

        return { ...contact, __typename: "Contact" };
      },
    }),
    emailAddress: t.field({
      type: EmailAddressTableModel,
      nullable: true,
      resolve: async (attachment, args, context: ContactApiServerContext) => {
        const emailAddress = await context.database
          .selectFrom("EmailAddress")
          .selectAll()
          .leftJoin("Contact", "Contact.emailId", "EmailAddress.id")
          .where("Contact.id", "=", attachment.contactId)
          .executeTakeFirstOrThrow();

        return { ...emailAddress, __typename: "EmailAddress" };
      },
    }),
  }),
});

builder.queryType({
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
});

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

/*email: t.field({
  type: EmailAddress,
  resolve: (contact, context: ContactApiServerContext) =>
    await context.database
      .selectFrom("EmailAddress")
      .selectAll()
      .where("EmailAddress.id", "=", contact.emailId)
      .execute(),
});

ContactType.implement({
  fields: (
    t: PothosSchemaTypes.ObjectFieldBuilder<
      PothosSchemaTypes.ExtendDefaultTypes<ContactApiBuilderOptions>,
      AllSelection<DB, "Contact">
    >
  ) => ({
    id: t.exposeID("id", { nullable: false }),
    createdAt: t.exposeString("createdAt", { nullable: false }),
    updatedAt: t.exposeString("updatedAt", { nullable: true }),
    reason: t.exposeString("reason", { nullable: false }),
    firstName: t.exposeString("firstName", { nullable: true }),
    lastName: t.exposeString("lastName", { nullable: true }),
    emailId: t.exposeID("emailId", { nullable: false }),
    phoneNumber: t.exposeString("phoneNumber", { nullable: true }),
    addressLine1: t.exposeString("addressLine1", { nullable: true }),
    addressLine2: t.exposeString("addressLine2", { nullable: true }),
    postalCode: t.exposeString("postalCode", { nullable: true }),
    city: t.exposeString("city", { nullable: true }),
    state: t.exposeString("state", { nullable: true }),
    countryCode: t.exposeString("countryCode", { nullable: true }),
    title: t.exposeString("title", { nullable: true }),
    companyName: t.exposeString("companyName", { nullable: true }),
    url: t.exposeString("url", { nullable: true }),
  }),
});

export const AttachmentResponseType = builder.simpleObject(
  "AttachmentResponseType",
  {
    fields: t => ({
      id: t.id({ nullable: false }),
      createdAt: t.string({ nullable: false }),
      updatedAt: t.string({ nullable: true }),
      name: t.string({ nullable: false }),
      path: t.string({ nullable: false }),
      status: t.string({ nullable: false }),
    }),
  }
);

export const ContactResponseType = builder.simpleObject("ContactResponseType", {
  fields: t => ({
    id: t.id({ nullable: false }),
    createdAt: t.field({ type: "DateTime", nullable: false }),
    updatedAt: t.field({ type: "DateTime", nullable: true }),
    reason: t.string({ nullable: false }),
    firstName: t.string({ nullable: true }),
    lastName: t.string({ nullable: true }),
    emailId: t.field({ type: "UUID", nullable: false }),
    email: t.field({ type: "EmailAddress", nullable: false }),
    subscribed: t.int({ nullable: false }),
    phoneNumber: t.field({ type: "PhoneNumber", nullable: true }),
    addressLine1: t.string({ nullable: true }),
    addressLine2: t.string({ nullable: true }),
    postalCode: t.field({ type: "PostalCode", nullable: true }),
    city: t.string({ nullable: true }),
    state: t.string({ nullable: true }),
    countryCode: t.field({ type: "CountryCode", nullable: true }),
    title: t.string({ nullable: true }),
    companyName: t.string({ nullable: true }),
    url: t.field({ type: "URL", nullable: true }),
  }),
});

export const SubscribedResponseType = builder.simpleObject(
  "SubscribedResponseType",
  {
    fields: t => ({
      id: t.id({ nullable: false }),
      email: t.field({ type: "EmailAddress", nullable: false }),
    }),
  }
);

export const AttachmentInput = builder.inputType("AttachmentInput", {
  fields: t => ({
    name: t.string({ required: true }),
    path: t.string({ required: true }),
    status: t.string({ required: false }),
  }),
});

export const CreateContactInput = builder.inputType("CreateContactInput", {
  fields: t => ({
    reason: t.string({ required: true }),
    firstName: t.string({ required: false }),
    lastName: t.string({ required: false }),
    email: t.field({ type: "EmailAddress", required: true }),
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
    attachments: t.field({ type: [AttachmentInput] }),
  }),
});

export const CreateContactResponseType = builder.simpleObject(
  "CreateContactResponseType",
  {
    fields: t => ({
      id: t.id({ nullable: false }),
    }),
  }
);
*/
