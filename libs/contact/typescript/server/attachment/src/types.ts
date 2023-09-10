import { UserContext } from "@open-system/core-server-application/types";
import { GraphQLServerContext } from "@open-system/core-server-graphql/types";
import {
  IContactAttachmentEntity,
  IContactEntity
} from "./__generated__/graphql/entities";

export type ContactGraphQLServerContext<
  TUser extends UserContext = UserContext
> = GraphQLServerContext<
  Array<IContactEntity | IContactAttachmentEntity>,
  TUser
>;
