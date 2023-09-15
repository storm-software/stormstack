import {
  ContactGraphQLInitialServerContext,
  ContactGraphQLServerContext,
  schema
} from "@open-system/contact-server-attachment";
import { GraphQLActiveServerContext } from "@open-system/core-server-graphql/context/context";
import { createGraphQLHandler } from "@open-system/core-server-graphql/server/handler";
import { GraphQLServerInstance } from "@open-system/core-server-graphql/types";

let server!: any;

export const createServer = async (): Promise<GraphQLServerInstance> => {
  if (!server) {
    server = await createGraphQLHandler<
      ContactGraphQLInitialServerContext,
      GraphQLActiveServerContext,
      ContactGraphQLServerContext
    >({
      schema,
      serviceProvidersOptions: {
        services: []
      }
    });
  }

  return server;
};
