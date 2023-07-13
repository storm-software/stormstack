/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  PageCursor,
  PageCursors,
  TableModel,
  resolveWindowedConnection,
} from "@open-system/core-server-data-access";
import { getUniqueNumericId } from "@open-system/core-shared-utilities";
import SchemaBuilder from "@pothos/core";
import RelayPlugin, { encodeGlobalID } from "@pothos/plugin-relay";
import {
  CountryCodeResolver,
  DateTimeResolver,
  PhoneNumberResolver,
  PostalCodeResolver,
  URLResolver,
  UUIDResolver,
} from "graphql-scalars";
import { DB } from "../db/types";
import { ContactApiBuilderOptions, ContactApiServerContext } from "../types";

export const builder = new SchemaBuilder<ContactApiBuilderOptions>({
  plugins: [RelayPlugin],
  relayOptions: {
    // These will become the defaults in the next major version
    clientMutationId: "required",
    cursorType: "String",
  },
});

builder.addScalarType("DateTime", DateTimeResolver, {});
builder.addScalarType("CountryCode", CountryCodeResolver, {});
// builder.addScalarType("EmailAddress", EmailAddressResolver, {});
builder.addScalarType("PhoneNumber", PhoneNumberResolver, {});
builder.addScalarType("PostalCode", PostalCodeResolver, {});
builder.addScalarType("URL", URLResolver, {});
builder.addScalarType("UUID", UUIDResolver, {});

/*builder.scalarType("DateTime", {
  serialize: (n: string) =>
    DateTime.create(n as string | bigint | Date | null | undefined).toString(),
  parseValue: (n: unknown) =>
    DateTime.create(n as string | bigint | Date | null | undefined).toString(),
});*/

builder.mutationType({});

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
  name: "Contact",
  id: {
    resolve: contact => contact.id,
  },
  loadOne: async (id, context: ContactApiServerContext) => {
    const contact = await context.database
      .selectFrom("Contact")
      .where("id", "=", id)
      .selectAll()
      .executeTakeFirstOrThrow();

    return { ...contact, __typename: "Contact" };
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
  name: "EmailAddress",
  id: {
    resolve: emailAddress => emailAddress.id,
  },
  loadOne: async (id, context: ContactApiServerContext) => {
    const emailAddress = await context.database
      .selectFrom("EmailAddress")
      .where("id", "=", id)
      .selectAll()
      .executeTakeFirstOrThrow();

    return { ...emailAddress, __typename: "EmailAddress" };
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
        id: t.arg.globalID({
          required: true,
        }),
      },
      resolve: async (root, args, context: ContactApiServerContext) => {
        const emailAddress = await context.database
          .selectFrom("EmailAddress")
          .where("id", "=", encodeGlobalID(args.id.typename, args.id.id))
          .selectAll()
          .executeTakeFirstOrThrow();

        return { ...emailAddress, __typename: "EmailAddress" };
      },
    }),
    emailAddresses: t.connection({
      type: EmailAddressTableModel,
      args: {
        ids: t.arg.globalIDList({
          required: true,
        }),
      },
      resolve: async (root, args, context: ContactApiServerContext) =>
        resolveWindowedConnection({ args }, async ({ limit, offset }) => {
          const emailAddresses = (
            await context.database
              .selectFrom("EmailAddress")
              .selectAll()
              .where(
                "EmailAddress.id",
                "in",
                args.ids.map(id => encodeGlobalID(id.typename, id.id))
              )
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
        id: t.arg.globalID({
          required: true,
        }),
      },
      resolve: async (root, args, context: ContactApiServerContext) => {
        const contact = await context.database
          .selectFrom("Contact")
          .selectAll()
          .where(
            "Contact.id",
            "=",
            encodeGlobalID(args.id.typename, args.id.id)
          )
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

builder.relayMutationField(
  "createContact",
  {
    inputFields: t => ({
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
      attachments: t.field({
        type: [CreateContactAttachment],
        required: false,
      }),
    }),
  },
  {
    resolve: async (parent, args, context: ContactApiServerContext) => {
      try {
        if (!context.database) {
          return { success: false };
        }

        const emailAddress = {
          id: encodeGlobalID("EmailAddress", getUniqueNumericId(4)),
          createdAt: new Date().toISOString(),
          email: args.input.email,
          subscribed: args.input.subscribed !== false ? 1 : 0,
        };
        await context.database
          .insertInto("EmailAddress")
          .values(emailAddress)
          .onConflict(oc =>
            oc.column("email").doUpdateSet({
              updatedAt: new Date().toISOString(),
              subscribed: eb => eb.ref("excluded.subscribed"),
            })
          )
          .execute();

        const contact = {
          id: encodeGlobalID("Contact", getUniqueNumericId(4)),
          createdAt: new Date().toISOString(),
          reason: args.input.reason,
          details: args.input.details,
          emailId: emailAddress.id,
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
        await context.database
          .insertInto("Contact")
          .values(contact)
          .onConflict(oc =>
            oc.column("id").doUpdateSet({
              updatedAt: new Date().toISOString(),
              reason: eb => eb.ref("excluded.reason"),
              firstName: eb => eb.ref("excluded.firstName"),
              lastName: eb => eb.ref("excluded.lastName"),
              phoneNumber: eb => eb.ref("excluded.phoneNumber"),
              addressLine1: eb => eb.ref("excluded.addressLine1"),
              addressLine2: eb => eb.ref("excluded.addressLine2"),
              city: eb => eb.ref("excluded.city"),
              state: eb => eb.ref("excluded.state"),
              countryCode: eb => eb.ref("excluded.countryCode"),
              title: eb => eb.ref("excluded.title"),
              companyName: eb => eb.ref("excluded.companyName"),
              url: eb => eb.ref("excluded.url"),
            })
          )
          .execute();

        if (args.input.attachments && args.input.attachments.length > 0) {
          const promises = args.input.attachments.map(
            (attachmentInput: any) => {
              const attachment = {
                id: encodeGlobalID("Attachment", getUniqueNumericId(4)),
                name: attachmentInput.name,
                path: attachmentInput.path,
                status: attachmentInput.status ?? "PENDING",
                contactId: contact.id,
              };

              return context.database
                .insertInto("Attachment")
                .values(attachment)
                .onConflict(oc =>
                  oc.column("id").doUpdateSet({
                    updatedAt: new Date().toISOString(),
                    name: eb => eb.ref("excluded.name"),
                    path: eb => eb.ref("excluded.path"),
                    status: eb => eb.ref("excluded.status"),
                  })
                )
                .execute();
            }
          );

          await Promise.all(promises);
        }

        return { success: true };
      } catch (e) {
        return { success: false };
      }
    },
  },
  {
    outputFields: t => ({
      success: t.boolean({
        resolve: result => result.success,
      }),
    }),
  }
);

builder.relayMutationField(
  "subscribeEmail",
  {
    inputFields: t => ({
      details: t.string({ required: false }),
      email: t.string({ required: true }),
      subscribed: t.boolean({ required: true }),
    }),
  },
  {
    resolve: async (parent, args, context: ContactApiServerContext) => {
      try {
        if (!context.database) {
          return { success: false };
        }

        const emailAddress = {
          id: encodeGlobalID("EmailAddress", getUniqueNumericId(4)),
          createdAt: new Date().toISOString(),
          email: args.input.email,
          subscribed: args.input.subscribed !== false ? 1 : 0,
        };
        await context.database
          .insertInto("EmailAddress")
          .values(emailAddress)
          .onConflict(oc =>
            oc.column("email").doUpdateSet({
              updatedAt: new Date().toISOString(),
              subscribed: eb => eb.ref("excluded.subscribed"),
            })
          )
          .execute();

        const contact = {
          id: encodeGlobalID("Contact", getUniqueNumericId(4)),
          createdAt: new Date().toISOString(),
          reason: "subscription",
          emailId: emailAddress.id,
          details: args.input.details,
        };
        await context.database
          .insertInto("Contact")
          .values(contact)
          .onConflict(oc =>
            oc.column("id").doUpdateSet({
              updatedAt: new Date().toISOString(),
              reason: eb => eb.ref("excluded.reason"),
              details: eb => eb.ref("excluded.details"),
            })
          )
          .execute();

        return { success: true };
      } catch (e) {
        return { success: false };
      }
    },
  },
  {
    outputFields: t => ({
      success: t.boolean({
        resolve: result => result.success,
      }),
    }),
  }
);
