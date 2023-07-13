/* eslint-disable @typescript-eslint/no-explicit-any */
import SchemaBuilder from "@pothos/core";
import RelayPlugin, {
  decodeGlobalID,
  encodeGlobalID,
} from "@pothos/plugin-relay";
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
import {
  ApiSchemaType,
  ApiServerContext,
  PageCursor,
  PageCursors,
} from "../types";

export const createSchemaBuilder = <
  TContext extends ApiServerContext = ApiServerContext
>() => {
  const builder = new SchemaBuilder<ApiSchemaType<TContext>>({
    plugins: [RelayPlugin],
    relayOptions: {
      // These will become the defaults in the next major version
      clientMutationId: "required",
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
      cursor: t.exposeString("cursor", {}),
      pageNumber: t.exposeInt("pageNumber", {}),
      isCurrent: t.exposeBoolean("isCurrent", {}),
    }),
  });

  builder.globalConnectionField("pageCursors", t =>
    t.field({
      type: PageCursorsRef,
      resolve: ({ pageCursors }: any) => pageCursors,
    })
  );

  return builder;
};
