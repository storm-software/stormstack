import { isInvocationExpr } from "@open-system/tools-storm-language/ast";
import { AstNode } from "langium/lib/syntax-tree";
import { isFromStdlib } from "../../language-server/utils";

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
