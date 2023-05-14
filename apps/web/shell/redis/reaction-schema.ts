import { Entity, Schema } from "redis-om";

export interface Reaction extends Entity {
  contentId: string;
  type: string;
  count: number;
}

export const schema = new Schema("reaction", {
  contentId: { type: "string" },
  type: { type: "string" },
  count: { type: "number", indexed: false },
});
