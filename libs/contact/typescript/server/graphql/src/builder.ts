/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma } from "@prisma/client/contact";
import { createSchemaBuilder } from "@stormstack/core-server-graphql";
import PrismaTypes from "./__generated__/types";
import { prisma } from "./client";
import { ContactApiServerContext } from "./types";

export const builder = createSchemaBuilder<
  PrismaTypes,
  ContactApiServerContext
>(prisma, Prisma.dmmf);

/*export const builder = new SchemaBuilder<{
  Context: any;
  PrismaTypes: PrismaTypes;
  Scalars: any;
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
  },
  notStrict:
    "Pothos may not work correctly when strict mode is not enabled in tsconfig.json",
  relayOptions: {
    clientMutationId: "optional",
    cursorType: "ID",
    idFieldName: "id",
    brandLoadedObjects: true,
    nodesOnConnection: true,
    encodeGlobalID,
    decodeGlobalID,
  },
});*/
