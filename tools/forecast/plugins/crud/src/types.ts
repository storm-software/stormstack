export type AggregateOperationSupport = {
  [model: string]: {
    count?: boolean;
    min?: boolean;
    max?: boolean;
    sum?: boolean;
    avg?: boolean;
  };
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
