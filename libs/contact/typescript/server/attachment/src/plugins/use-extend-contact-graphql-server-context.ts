/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Plugin } from "@envelop/types";
import {
  InitialServerContext,
  Repository
} from "@open-system/core-server-application";
import { useExtendCloudflareGraphQLServerContext } from "@open-system/core-server-cloudflare/plugins";
import { CloudflareServerBindingsContext } from "@open-system/core-server-cloudflare/types";
import {
  GraphQLActiveServerContext,
  GraphQLServerContext
} from "@open-system/core-server-graphql/context";
import {
  IContactAttachmentEntity,
  IContactEntity
} from "../__generated__/graphql";
import {
  ContactAttachmentRepository,
  ContactRepository
} from "../__generated__/graphql/repositories";

export const useExtendContactGraphQLServerContext = <
  TInitialContext extends InitialServerContext = InitialServerContext,
  TActiveContext extends GraphQLActiveServerContext = GraphQLActiveServerContext
>(
  initialContext: TInitialContext
): Plugin<
  GraphQLServerContext<
    TInitialContext,
    TActiveContext,
    CloudflareServerBindingsContext
  >
> => {
  const basePlugin = useExtendCloudflareGraphQLServerContext<
    TInitialContext,
    TActiveContext
  >(initialContext);

  return {
    ...basePlugin,
    async onContextBuilding(params) {
      const pluginHook = await basePlugin.onContextBuilding?.(params);

      params.context.injector
        .bind<Repository<IContactAttachmentEntity>>(
          Repository<IContactAttachmentEntity>
        )
        .to(ContactAttachmentRepository)
        .inSingletonScope();

      params.context.injector
        .bind<Repository<IContactEntity>>(Repository<IContactEntity>)
        .to(ContactRepository)
        .inSingletonScope();

      return pluginHook;
    }
  };
};
