import { isInvocationExpr } from "@stormstack/tools-forecast-language/ast";
import { isFromStdlib } from "@stormstack/tools-forecast-language/utils";
import { AstNode } from "langium/lib/syntax-tree";

/**
 * Returns if the given expression is a "future()" method call.
 */
export function isFutureExpr(node: AstNode) {
  return !!(
    isInvocationExpr(node) &&
    node.function.ref?.name === "future" &&
    isFromStdlib(node.function.ref)
  );
}
