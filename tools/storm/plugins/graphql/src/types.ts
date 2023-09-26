import { DMMF as PrismaDMMF } from "@prisma/generator-helper";
import {
  ApiModel,
  DataModel,
  Enum,
  Input,
  Interface,
  Model,
  OperationGroup
} from "@stormstack/tools-storm-language/ast";
import { Project } from "ts-morph";

export type TransformerParams = {
  enumTypes?: PrismaDMMF.SchemaEnum[];
  fields?: PrismaDMMF.SchemaArg[];
  name?: string;
  models?: PrismaDMMF.Model[];
  modelOperations?: PrismaDMMF.ModelMapping[];
  aggregateOperationSupport?: AggregateOperationSupport;
  isDefaultPrismaClientOutput?: boolean;
  prismaClientOutputPath?: string;
  project: Project;
  storm: Model;
};

export type AggregateOperationSupport = {
  [model: string]: {
    count?: boolean;
    min?: boolean;
    max?: boolean;
    sum?: boolean;
    avg?: boolean;
  };
};

export type EnrichModelReturn = {
  dataModels: DataModel[];
  operationGroups: OperationGroup[];
  inputs: Input[];
  apiModels: ApiModel[];
  interfaces: Interface[];
  enums: Enum[];
};

export const ENTITY_CLASS_FIELDS = [
  "id",
  "createdAt",
  "createdBy",
  "updatedAt",
  "updatedBy",
  "sequence"
] as const;
export type EntityClassFields = (typeof ENTITY_CLASS_FIELDS)[number];
