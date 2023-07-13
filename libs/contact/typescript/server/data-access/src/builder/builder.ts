/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  TableModel,
  createSchemaBuilder,
  resolveWindowedConnection,
} from "@open-system/core-server-data-access";
import { InsertObjectOrList } from "kysely/dist/cjs/parser/insert-values-parser";
import { DB } from "../db/types";
import { ContactApiServerContext } from "../types";

/*export const builder = new SchemaBuilder<
  ApiSchemaType<ContactApiServerContext>
>({
  plugins: [RelayPlugin],
  relayOptions: {
    // These will become the defaults in the next major version
    clientMutationId: "required",
    cursorType: "String",
  },
});

/*builder.scalarType("DateTime", {
  serialize: (n: string) =>
    DateTime.create(n as string | bigint | Date | null | undefined).toString(),
  parseValue: (n: unknown) =>
    DateTime.create(n as string | bigint | Date | null | undefined).toString(),
});*/

/*builder.mutationType({});

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
);*/

export const builder = createSchemaBuilder<ContactApiServerContext>();

export const ContactTableModel =
  builder.objectRef<TableModel<DB, "Contact">>("Contact");
export const ContactAttachmentTableModel =
  builder.objectRef<TableModel<DB, "ContactAttachment">>("ContactAttachment");
export const ContactEmailTableModel =
  builder.objectRef<TableModel<DB, "ContactEmail">>("ContactEmail");

builder.node(ContactTableModel, {
  name: "Contact",
  id: {
    resolve: contact => contact.id,
  },
  loadOne: async (id, context: ContactApiServerContext) => {
    const contact = await context.database
      .selectFrom("Contact")
      .where("id", "=", Number(id))
      .selectAll()
      .executeTakeFirstOrThrow();

    return { ...contact, __typename: "Contact" };
  },
  loadMany: async (ids, context: ContactApiServerContext) => {
    return (
      await context.database
        .selectFrom("Contact")
        .where(
          "id",
          "in",
          ids.map(id => Number(id))
        )
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
      type: ContactAttachmentTableModel,
      resolve: (contact, args, context: ContactApiServerContext) =>
        resolveWindowedConnection({ args }, async ({ limit, offset }) => {
          const contactAttachments = (
            await context.database
              .selectFrom("ContactAttachment")
              .selectAll()
              .where("ContactAttachment.contactId", "=", contact.id)
              .execute()
          ).map(contactAttachment => ({
            ...contactAttachment,
            __typename: "ContactAttachment",
          }));

          return {
            items: contactAttachments.slice(offset, offset + limit),
            totalCount: contactAttachments.length,
          };
        }),
    }),
  }),
});

builder.node(ContactEmailTableModel, {
  name: "ContactEmail",
  id: {
    resolve: contactEmail => contactEmail.id,
  },
  loadOne: async (id, context: ContactApiServerContext) => {
    const contactEmail = await context.database
      .selectFrom("ContactEmail")
      .where("id", "=", Number(id))
      .selectAll()
      .executeTakeFirstOrThrow();

    return { ...contactEmail, __typename: "ContactEmail" };
  },
  loadMany: async (ids, context: ContactApiServerContext) => {
    return (
      await context.database
        .selectFrom("ContactEmail")
        .where(
          "id",
          "in",
          ids.map(id => Number(id))
        )
        .selectAll()
        .execute()
    ).map(contactEmail => ({ ...contactEmail, __typename: "ContactEmail" }));
  },
  fields: t => ({
    createdAt: t.exposeString("createdAt", { nullable: false }),
    updatedAt: t.exposeString("updatedAt", { nullable: true }),
    email: t.exposeString("email", { nullable: false }),
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

ContactAttachmentTableModel.implement({
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
    contactEmail: t.field({
      type: ContactEmailTableModel,
      nullable: true,
      resolve: async (
        contactAttachment,
        args,
        context: ContactApiServerContext
      ) => {
        const contactEmail = await context.database
          .selectFrom("ContactEmail")
          .selectAll()
          .leftJoin("Contact", "Contact.emailId", "ContactEmail.id")
          .where("Contact.id", "=", contactAttachment.contactId)
          .executeTakeFirstOrThrow();

        return { ...contactEmail, __typename: "ContactEmail" };
      },
    }),
  }),
});

builder.queryType({
  fields: t => ({
    contactEmail: t.field({
      type: ContactEmailTableModel,
      nullable: true,
      args: {
        id: t.arg.globalID({
          required: true,
        }),
      },
      resolve: async (root, args, context: ContactApiServerContext) => {
        const contactEmail = await context.database
          .selectFrom("ContactEmail")
          .where("id", "=", Number(args.id.id))
          .selectAll()
          .executeTakeFirstOrThrow();

        return { ...contactEmail, __typename: "ContactEmail" };
      },
    }),
    emailAddresses: t.connection({
      type: ContactEmailTableModel,
      args: {
        ids: t.arg.globalIDList({
          required: true,
        }),
      },
      resolve: async (root, args, context: ContactApiServerContext) =>
        resolveWindowedConnection({ args }, async ({ limit, offset }) => {
          const contactEmails = (
            await context.database
              .selectFrom("ContactEmail")
              .selectAll()
              .where(
                "ContactEmail.id",
                "in",
                args.ids.map(id => Number(id.id))
              )
              .execute()
          ).map(contactEmail => ({
            ...contactEmail,
            __typename: "ContactEmail",
          }));

          return {
            items: contactEmails.slice(offset, offset + limit),
            totalCount: contactEmails.length,
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
          .where("Contact.id", "=", Number(args.id.id))
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

        const contactEmail = {
          createdAt: new Date().toISOString(),
          createdBy: context.user.id,
          email: args.input.email,
        };
        const returnedEmail = await context.database
          .insertInto("ContactEmail")
          .values(contactEmail as InsertObjectOrList<DB, "ContactEmail">)
          .onConflict(oc =>
            oc.column("email").doUpdateSet({
              updatedAt: new Date().toISOString(),
              updatedBy: context.user.id,
            })
          )
          .returningAll()
          .executeTakeFirstOrThrow();

        const contact = {
          createdAt: new Date().toISOString(),
          createdBy: context.user.id,
          reason: args.input.reason,
          details: args.input.details,
          emailId: returnedEmail.id,
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
        const returnedContact = await context.database
          .insertInto("Contact")
          .values(contact as InsertObjectOrList<DB, "Contact">)
          .onConflict(oc =>
            oc.column("id").doUpdateSet({
              updatedAt: new Date().toISOString(),
              updatedBy: context.user.id,
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
          .returningAll()
          .executeTakeFirstOrThrow();

        if (args.input.attachments && args.input.attachments.length > 0) {
          const promises = args.input.attachments.map(
            (attachmentInput: any) => {
              const contactAttachment = {
                createdAt: new Date().toISOString(),
                createdBy: context.user.id,
                name: attachmentInput.name,
                path: attachmentInput.path,
                status: attachmentInput.status ?? "pending",
                contactId: returnedContact.id,
              };

              return context.database
                .insertInto("ContactAttachment")
                .values(contactAttachment)
                .onConflict(oc =>
                  oc.column("id").doUpdateSet({
                    updatedAt: new Date().toISOString(),
                    updatedBy: context.user.id,
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

/*builder.relayMutationField(
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
);*/
