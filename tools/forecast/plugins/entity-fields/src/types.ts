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

export type IdFieldFormat = "uuid" | "cuid" | "snowflake" | "autoincrement";
export const IdFieldFormat = {
  UUID: "uuid" as IdFieldFormat,
  CUID: "cuid" as IdFieldFormat,
  SNOWFLAKE: "snowflake" as IdFieldFormat,
  AUTO_INCREMENT: "autoincrement" as IdFieldFormat
};

export type EntityFieldsPluginOptions = PluginOptions & {
  /**
   * The name of the ID field.
   *
   * @default "id"
   */
  idName?: string;

  /**
   * The identity generator type to use for the `id` field.
   *
   * @default "uuid"
   */
  idFormat?: IdFieldFormat;

  /**
   * The name of the `isDeleted` field.
   *
   * @default "isDeleted"
   */
  isDeleted?: boolean;

  /**
   * The name of the `createdAt` field.
   *
   * @default "createdAt"
   */
  createdAtName?: string;

  /**
   * The name of the `createdBy` field.
   *
   * @default "createdBy"
   */
  createdByName?: string;

  /**
   * The name of the `updatedAt` field.
   *
   * @default "updatedAt"
   */
  updatedAtName?: string;

  /**
   * The name of the `updatedBy` field.
   *
   * @default "updatedBy"
   */
  updatedByName?: string;

  /**
   * The name of the `sequence` field.
   *
   * @default "sequence"
   */
  sequenceName?: string;
};
