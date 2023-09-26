/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ExecutionContext,
  GlobalContext,
  Repository,
  ServerContext
} from "@stormstack/core-server-application";
import { bindService } from "@stormstack/core-shared-injection/utilities/bind-service";
import {
  IContactAttachmentEntity,
  IContactEntity
} from "../__generated__/graphql";
import {
  ContactAttachmentRepository,
  ContactRepository
} from "../__generated__/graphql/repositories";

export const extendContactServerContext = <
  TGlobalContext extends GlobalContext = GlobalContext,
  TExecutionContext extends ExecutionContext = ExecutionContext
>(
  context: ServerContext<TGlobalContext, TExecutionContext>,
  executionContext: TExecutionContext
): ServerContext<TGlobalContext, TExecutionContext> => {
  bindService<Repository<IContactAttachmentEntity>>(
    Repository<IContactAttachmentEntity>,
    ContactAttachmentRepository,
    context.injector
  );
  bindService<Repository<IContactEntity>>(
    Repository<IContactEntity>,
    ContactRepository,
    context.injector
  );

  return context;
};
