import {
  GlobalContext,
  UtilityContext
} from "@stormstack/core-server-application/context";
import { CloudflareServerBindings } from "@stormstack/core-server-cloudflare/types";
import {
  GraphQLExecutionContext,
  GraphQLServerContext
} from "@stormstack/core-server-graphql/context";
import { IContactAttachmentEntity } from "../__generated__/graphql/entities/contact-attachment-entity.interface";
import { IContactEntity } from "../__generated__/graphql/entities/contact-entity.interface";

export type ContactGraphQLInitialServerContext = GlobalContext<
  Array<IContactEntity | IContactAttachmentEntity>,
  UtilityContext,
  CloudflareServerBindings
>;

export type ContactGraphQLServerContext<
  TInitialContext extends ContactGraphQLInitialServerContext = ContactGraphQLInitialServerContext,
  TActiveContext extends GraphQLExecutionContext = GraphQLExecutionContext,
  TBindings extends CloudflareServerBindings = CloudflareServerBindings
> = GraphQLServerContext<TInitialContext, TActiveContext, TBindings>;
