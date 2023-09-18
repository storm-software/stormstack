import {
  GlobalServerContext,
  UtilityContext
} from "@open-system/core-server-application/context";
import { CloudflareServerBindings } from "@open-system/core-server-cloudflare/types";
import {
  GraphQLExecutionServerContext,
  GraphQLServerContext
} from "@open-system/core-server-graphql/context";
import { IContactAttachmentEntity } from "../__generated__/graphql/entities/contact-attachment-entity.interface";
import { IContactEntity } from "../__generated__/graphql/entities/contact-entity.interface";

export type ContactGraphQLInitialServerContext = GlobalServerContext<
  Array<IContactEntity | IContactAttachmentEntity>,
  UtilityContext,
  CloudflareServerBindings
>;

export type ContactGraphQLServerContext<
  TInitialContext extends ContactGraphQLInitialServerContext = ContactGraphQLInitialServerContext,
  TActiveContext extends GraphQLExecutionServerContext = GraphQLExecutionServerContext,
  TBindings extends CloudflareServerBindings = CloudflareServerBindings
> = GraphQLServerContext<TInitialContext, TActiveContext, TBindings>;
