import { createModule } from "graphql-modules";
import { generateAllCrud } from "./__generated__/crud/autocrud";
import { builder } from "./builder";

generateAllCrud();

export const schema = builder.toSchema();
export const module = createModule({
  id: "contact",
  dirname: __dirname,
  typeDefs: schema.typeDefs,
  resolvers: schema.resolvers,
  providers: [],
});
