/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ContactGraphQLInitialServerContext,
  ContactGraphQLServerContext,
  schema
} from "@open-system/contact-server-attachment";
import { GraphQLExecutionServerContext } from "@open-system/core-server-graphql/context/context";
import { createGraphQLHandler } from "@open-system/core-server-graphql/server/handler";
import { GraphQLServerInstance } from "@open-system/core-server-graphql/types";

let server!: GraphQLServerInstance;
export const createServer = async (): Promise<GraphQLServerInstance> => {
  if (!server) {
    server = await createGraphQLHandler<
      ContactGraphQLInitialServerContext,
      GraphQLExecutionServerContext,
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
