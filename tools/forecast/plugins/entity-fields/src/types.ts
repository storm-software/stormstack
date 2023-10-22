import { PluginOptions } from "@stormstack/tools-forecast-codegen";

export const ENTITY_CLASS_FIELDS = [
  "id",
  "createdAt",
  "createdBy",
  "updatedAt",
  "updatedBy",
  "sequence"
] as const;

export type EntityClassFields = (typeof ENTITY_CLASS_FIELDS)[number];

export type IdentityFieldGenerator =
  | "uuid"
  | "cuid"
  | "snowflake"
  | "autoincrement";
export const IdentityFieldGenerator = {
  UUID: "uuid" as IdentityFieldGenerator,
  CUID: "cuid" as IdentityFieldGenerator,
  SNOWFLAKE: "snowflake" as IdentityFieldGenerator,
  AUTO_INCREMENT: "autoincrement" as IdentityFieldGenerator
};

export type EntityFieldsPluginOptions = PluginOptions & {
  identityGenerator?: IdentityFieldGenerator;
};
