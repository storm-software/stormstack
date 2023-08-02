/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseError } from "@open-system/core-shared-utilities";
import SchemaBuilder from "@pothos/core";
import ErrorsPlugin from "@pothos/plugin-errors";
import PrismaPlugin from "@pothos/plugin-prisma";
import RelayPlugin, {
  decodeGlobalID,
  encodeGlobalID,
} from "@pothos/plugin-relay";
import ValidationPlugin from "@pothos/plugin-validation";
import {
  CountryCodeResolver,
  CurrencyResolver,
  DateResolver,
  DateTimeResolver,
  DurationResolver,
  EmailAddressResolver,
  IPResolver,
  JWTResolver,
  LatitudeResolver,
  LocaleResolver,
  LongitudeResolver,
  PhoneNumberResolver,
  PostalCodeResolver,
  SemVerResolver,
  URLResolver,
  UUIDResolver,
} from "graphql-scalars";
import { ZodFormattedError } from "zod";
import {
  ApiSchemaType,
  GraphQLServerContext,
  PageCursor,
  PageCursors,
} from "../types";

// Util for flattening zod errors into something easier to represent in your Schema.
function flattenErrors(
  error: ZodFormattedError<unknown>,
  path: string[]
): { path: string[]; message: string }[] {
  // eslint-disable-next-line no-underscore-dangle
  const errors = error._errors.map((message: string) => ({
    path,
    message,
  }));

  Object.keys(error).forEach(key => {
    if (key !== "_errors") {
      errors.push(
        ...flattenErrors(
          (error as Record<string, unknown>)[key] as ZodFormattedError<unknown>,
          [...path, key]
        )
      );
    }
  });

  return errors;
}

export const createSchemaBuilder = <
  PrismaTypes,
  TContext extends GraphQLServerContext = GraphQLServerContext
>(
  client: any
) => {
  const builder = new SchemaBuilder<ApiSchemaType<PrismaTypes, TContext>>({
    plugins: [ErrorsPlugin, ValidationPlugin, PrismaPlugin, RelayPlugin],
    errorOptions: {
      defaultTypes: [BaseError],
    },
    validationOptions: {
      // optionally customize how errors are formatted
      validationError: (zodError, args, context, info) => {
        // the default behavior is to just throw the zod error directly
        return zodError;
      },
    },
    prisma: {
      client,
      // use where clause from prismaRelatedConnection for totalCount
      filterConnectionTotalCount: true,
    },
    relayOptions: {
      clientMutationId: "optional",
      cursorType: "String",
      idFieldName: "id",
      brandLoadedObjects: true,
      encodeGlobalID,
      decodeGlobalID,
    },
  });

  builder.mutationType({});

  builder.addScalarType("Date", DateResolver, {});
  builder.addScalarType("DateTime", DateTimeResolver, {});
  builder.addScalarType("CountryCode", CountryCodeResolver, {});
  builder.addScalarType("EmailAddress", EmailAddressResolver, {});
  builder.addScalarType("PhoneNumber", PhoneNumberResolver, {});
  builder.addScalarType("PostalCode", PostalCodeResolver, {});
  builder.addScalarType("URL", URLResolver, {});
  builder.addScalarType("UUID", UUIDResolver, {});
  builder.addScalarType("Currency", CurrencyResolver, {});
  builder.addScalarType("Duration", DurationResolver, {});
  builder.addScalarType("IP", IPResolver, {});
  builder.addScalarType("Latitude", LatitudeResolver, {});
  builder.addScalarType("Longitude", LongitudeResolver, {});
  builder.addScalarType("Locale", LocaleResolver, {});
  builder.addScalarType("SemVer", SemVerResolver, {});
  builder.addScalarType("JWT", JWTResolver, {});

  const PageCursorRef = builder.objectRef<PageCursor>("PageCursor");

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

  PageCursorRef.implement({
    fields: t => ({
      cursor: t.exposeString("cursor"),
      pageNumber: t.exposeInt("pageNumber"),
      isCurrent: t.exposeBoolean("isCurrent"),
    }),
  });

  builder.globalConnectionField("pageCursors", t =>
    t.field({
      type: PageCursorsRef,
      resolve: ({ pageCursors }: any) => pageCursors,
    })
  );

  const ErrorInterface = builder
    .interfaceRef<BaseError>("BaseError")
    .implement({
      fields: t => ({
        message: t.exposeString("message"),
      }),
    });

  // A type for the individual validation issues
  const FieldBaseError = builder
    .objectRef<{
      message: string;
      path: string[];
    }>("FieldBaseError")
    .implement({
      fields: t => ({
        message: t.exposeString("message"),
        path: t.exposeStringList("path"),
      }),
    });

  // The actual error type
  builder.objectType(BaseError, {
    name: "BaseError",
    interfaces: [ErrorInterface],
    fields: t => ({
      errors: t.field({
        type: [FieldBaseError],
        resolve: err => flattenErrors(err.format(), []),
      }),
    }),
  });

  return builder;
};
