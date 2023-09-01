import { Plugin } from "@envelop/types";
import { UserContext } from "@open-system/core-server-application";
import { GraphQLServerContext } from "../types";

export const useHive = async <
  TUser extends UserContext = UserContext,
  TServerContext extends GraphQLServerContext<TUser> = GraphQLServerContext<TUser>
>(
  env: TServerContext["env"]
): Promise<Plugin<TServerContext>> => {
  return useHive({
    enabled: true,
    token: await env.getAsync<string>("HIVE_ACCESS_TOKEN"),
    usage: {
      clientInfo(ctx: { req: Request }) {
        const name =
          ctx.req.headers.get("x-graphql-client-name") ?? "Open System Dev";
        const version =
          ctx.req.headers.get("x-graphql-client-version") ?? "1.0";

        return { name, version };
      }
    }
  }) as Plugin<TServerContext>;
};
