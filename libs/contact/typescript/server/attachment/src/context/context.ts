import {
  InitialServerContext,
  UtilityContext
} from "@open-system/core-server-application/context";
import { CloudflareServerBindings } from "@open-system/core-server-cloudflare/types";
import {
  GraphQLActiveServerContext,
  GraphQLServerContext
} from "@open-system/core-server-graphql/context";
import { IContactAttachmentEntity } from "../__generated__/graphql/entities/contact-attachment-entity.interface";
import { IContactEntity } from "../__generated__/graphql/entities/contact-entity.interface";

export type ContactGraphQLInitialServerContext = InitialServerContext<
  Array<IContactEntity | IContactAttachmentEntity>,
  UtilityContext,
  CloudflareServerBindings
>;

export type ContactGraphQLServerContext<
  TInitialContext extends ContactGraphQLInitialServerContext = ContactGraphQLInitialServerContext,
  TActiveContext extends GraphQLActiveServerContext = GraphQLActiveServerContext,
  TBindings extends CloudflareServerBindings = CloudflareServerBindings
> = GraphQLServerContext<TInitialContext, TActiveContext, TBindings>;
