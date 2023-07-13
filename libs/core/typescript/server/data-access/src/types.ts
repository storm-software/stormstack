/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { AllSelection } from "kysely/dist/cjs/parser/select-parser";

export type ServerContext<TContext = {}> = Record<string, any> & TContext;
export type ApiServerContext<
  TDatabase = {},
  TContext = {},
  TUserContext = {}
> = ServerContext<TContext> & {
  database: TDatabase;
  user: UserContext<TUserContext>;
};

export type UserContext<TContext = {}> = Record<string, any> &
  TContext & {
    id: number;
    name?: string;
    email?: string;
  };

export type ApiServerConnection = {
  pageCursors: PageCursors;
};

export interface PageCursor {
  cursor: string;
  pageNumber: number;
  isCurrent: boolean;
}

export interface PageCursors {
  first: PageCursor;
  around: PageCursor[];
  last: PageCursor;
}

export type TableModel<
  TDatabase,
  TTypename extends keyof TDatabase
> = AllSelection<TDatabase, TTypename> & { __typename: TTypename | string };
