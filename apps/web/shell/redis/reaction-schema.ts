import { Entity, Schema } from "redis-om";

export interface Reaction extends Entity {
  clientId: string;
  type: string;
  count: number;
}

export const schema = new Schema("reaction", {
  clientId: { type: "string" },
  type: { type: "string" },
  count: { type: "number" },
});
