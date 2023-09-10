import { Repository } from "@open-system/core-server-application";
import { UserContext } from "@open-system/core-server-application/types";
import { createGraphQLServerContext } from "@open-system/core-server-graphql/context";
import { CreateGraphQLServerContextParams } from "@open-system/core-server-graphql/types";
import { InfisicalEnvManager } from "@open-system/core-server-infisical";
import { PinoLogger } from "@open-system/core-server-pino-logging";
import { EnvManager } from "@open-system/core-shared-env";
import { Logger } from "@open-system/core-shared-utilities";
import {
  IContactAttachmentEntity,
  IContactEntity
} from "../__generated__/graphql/entities";
import {
  ContactAttachmentRepository,
  ContactRepository
} from "../__generated__/graphql/repositories";
import { ContactGraphQLServerContext } from "../types";

export const createContactGraphQLServerContext = <
  TUser extends UserContext = UserContext
>(
  params: CreateGraphQLServerContextParams<TUser>
): ContactGraphQLServerContext<TUser> => {
  const context = createGraphQLServerContext<
    Array<IContactEntity | IContactAttachmentEntity>,
    TUser
  >(params);

  context.injector.bind(Logger).to(PinoLogger).inSingletonScope();
  context.injector.bind(EnvManager).to(InfisicalEnvManager).inSingletonScope();

  context.injector
    .bind<Repository<IContactAttachmentEntity>>(
      Repository<IContactAttachmentEntity>
    )
    .to(ContactAttachmentRepository)
    .inSingletonScope();
  context.injector
    .bind<Repository<IContactEntity>>(Repository<IContactEntity>)
    .to(ContactRepository)
    .inSingletonScope();

  return context as ContactGraphQLServerContext<TUser>;
};
