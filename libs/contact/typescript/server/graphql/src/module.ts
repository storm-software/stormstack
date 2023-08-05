// import { schemaPrinter } from "@open-system/core-server-graphql";
import { generateAllCrud } from "./__generated__/crud/autocrud";
import { builder } from "./builder";

generateAllCrud();

builder.queryType({});
builder.mutationType({});

export const schema = builder.toSchema({});

// schemaPrinter("./__generated__/schema.graphql", schema);

/*export const module = createModule({
  id: "contact",
  dirname: __dirname,
  typeDefs: schema.typeDefs,
  resolvers: schema.resolvers,
  providers: [],
});*/
