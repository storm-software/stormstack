import { isSymbol } from "@stormstack/core-shared-utilities";
import { HeaderProxy, HeaderTypes } from "../types";
import { HeadersMap } from "./headers-map";

export const createApiHeadersProxy = (
  param: Headers | HeadersMap = new Headers()
): HeaderProxy => {
  const headersMap = HeadersMap.isHeadersMap(param)
    ? param
    : HeadersMap.normalize(param);

  return new Proxy<HeaderProxy>(headersMap as any, {
    get: async (_: HeaderProxy, prop: string | symbol) => {
      switch (prop) {
        case "has":
          return (key: string) => headersMap.has(key.toLowerCase());
        case "get":
          return (key: string) => headersMap.get(key.toLowerCase());
        case "set":
          return (key: string, value: string) => {
            return headersMap.set(key.toLowerCase(), value);
          };
        case "merge":
          return (params?: HeaderProxy | HeadersMap | Headers) => {
            if (params) {
              if (HeadersMap.isHeadersMap(params)) {
                params.headers.forEach((value, key) => {
                  headersMap.set(key, value);
                });
              } else {
                for (const [key, value] of Object.entries(params)) {
                  headersMap.set(key, value);
                }
              }
            }
          };
        case "delete":
          return (key: string) => {
            return headersMap.delete(key.toLowerCase());
          };
        case "cookie":
          return headersMap.get(HeaderTypes.SET_COOKIE);
        case "keys":
          return headersMap.keys();
        case "values":
          return headersMap.values();
        case "entries":
          return headersMap.entries();
        case "forEach":
          return (callbackfn: (value: string, key: string) => void) =>
            headersMap.forEach(callbackfn);
        case "append":
          return (key: string, value: string) => {
            return headersMap.set(key.toLowerCase(), value);
          };
        case "getAll":
          return (key: string) =>
            headersMap.get(key.toLowerCase())?.split(", ") ?? [];
        case "clone":
          return () => createApiHeadersProxy(headersMap);
        case "normalize":
          return (headersObj: Headers) => HeadersMap.normalize(headersObj);
        case "headers":
          return headersMap.getHeaders();
        default:
          if (isSymbol(prop)) {
            if (prop === Symbol.iterator) {
              return headersMap.getHeaders()[Symbol.iterator];
            } else {
              return undefined;
            }
          } else {
            return headersMap.get(prop);
          }
      }
    },
    set: (_: HeaderProxy, prop: string, newValue: any, __: any): boolean => {
      switch (prop) {
        case "cookie":
          headersMap.set(prop, newValue);
          break;
        default:
          headersMap.set(prop, newValue);
          break;
      }

      return true;
    }
  });
};
