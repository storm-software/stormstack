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
import { ApiSchemaType, GraphQLServerContext } from "../types";

export const addScalarTypes = <
  TContext extends GraphQLServerContext = GraphQLServerContext,
  TSchemaType extends ApiSchemaType<TContext> = ApiSchemaType<TContext>
>(
  builder: PothosSchemaTypes.SchemaBuilder<
    PothosSchemaTypes.ExtendDefaultTypes<TSchemaType>
  >
): PothosSchemaTypes.SchemaBuilder<
  PothosSchemaTypes.ExtendDefaultTypes<TSchemaType>
> => {
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

  return builder;
};
