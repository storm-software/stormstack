import { createSchema } from "@open-system/core-server-graphql/schema";
import {
  IContactAttachmentEntity,
  IContactEntity
} from "../__generated__/graphql/entities";
import { resolvers } from "../__generated__/graphql/resolvers";

export const schema = createSchema<
  Array<IContactEntity | IContactAttachmentEntity>
>({
  typeDefs: "./src/__generated__/graphql/schema.graphql",
  resolvers
});
