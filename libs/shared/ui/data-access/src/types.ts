export type HttpMethods = "DELETE" | "GET" | "HEAD" | "POST" | "PUT" | "PATCH";
export const HttpMethods = {
  DELETE: "DELETE" as HttpMethods,
  GET: "GET" as HttpMethods,
  HEAD: "HEAD" as HttpMethods,
  POST: "POST" as HttpMethods,
  PUT: "PUT" as HttpMethods,
  PATCH: "PATCH" as HttpMethods,
};

export type CredentialOption = "include" | "same-origin" | "omit";

export type Url = string;

export type RequestBody = any;

export type RequestHeaders = Record<string, any>;

export type Meta = Record<string, any>;

export type QueryKey = string;

export type ResponseBody = any;

export type ResponseText = string;

export type Status = number;

export type Duration = number;

export type Entities = Record<string, any>;

export type Transform = (
  body?: ResponseBody,
  text?: ResponseText
) => Record<string, any>;

export type Update = Record<string, (prevValue: any, newValue: any) => any>;

export type OptimisticUpdate = Record<string, (prevValue: any) => any>;

export type Rollback = Record<
  string,
  (initialValue: any, currentValue: any) => any
>;

export type QueryOptions = {
  credentials?: CredentialOption;
  method?: HttpMethods;
  headers?: { [key: string]: any };
};

export type QueryConfig = {
  body?: RequestBody;
  force?: boolean;
  meta?: Meta;
  options?: QueryOptions;
  queryKey?: QueryKey;
  transform?: Transform;
  update?: Update;
  optimisticUpdate?: OptimisticUpdate;
  retry?: boolean;
  rollback?: Rollback;
  unstable_preDispatchCallback?: () => void;
  url: Url;
};
