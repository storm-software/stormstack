import { lowerCaseFirst } from "@open-system/core-shared-utilities";
import {
  DataModel,
  Expression,
  isBinaryExpr,
  isDataModel,
  isDataModelField,
  isEnum,
  isExpression,
  isInvocationExpr,
  isMemberAccessExpr,
  isReferenceExpr,
  isThisExpr,
  isUnaryExpr,
  MemberAccessExpr,
  Model,
} from "@open-system/tools-storm-language/ast";
import type {
  PolicyKind,
  PolicyOperationKind,
} from "@open-system/tools-storm-runtime";
import { streamAllContents } from "langium";
import path from "path";
import {
  FunctionDeclaration,
  SourceFile,
  StatementStructures,
  VariableDeclarationKind,
  WriterFunction,
} from "ts-morph";
import { name } from ".";
import { isFromStdlib } from "../../language-server/utils";
import {
  analyzePolicies,
  createProject,
  emitProject,
  ExpressionContext,
  getDataModels,
  getLiteral,
  getPrismaClientImportSpec,
  hasAttribute,
  hasValidationAttributes,
  PluginError,
  PluginOptions,
  resolved,
  resolvePath,
  RUNTIME_PACKAGE,
  saveProject,
} from "../../sdk";
import { getIdFields, isAuthInvocation } from "../../utils/ast-utils";
import {
  TypeScriptExpressionTransformer,
  TypeScriptExpressionTransformerError,
} from "../../utils/typescript-expression-transformer";
import { ALL_OPERATION_KINDS, getDefaultOutputFolder } from "../plugin-utils";
import { ExpressionWriter, FALSE, TRUE } from "./expression-writer";
import { isFutureExpr } from "./utils";

/**
 * Generates source file that contains Prisma query guard objects used for injecting database queries
 */
export default class PolicyGenerator {
  async generate(model: Model, options: PluginOptions) {
    let output = options.output
      ? (options.output as string)
      : getDefaultOutputFolder();
    if (!output) {
      throw new PluginError(
        options.name,
        `Unable to determine output path, not running plugin`
      );
    }
    output = resolvePath(output, options);

    const project = createProject();
    const sf = project.createSourceFile(
      path.join(output, "policy.ts"),
      undefined,
      { overwrite: true }
    );
    sf.addStatements("/* eslint-disable */");

    sf.addImportDeclaration({
      namedImports: [{ name: "type QueryContext" }, { name: "hasAllFields" }],
      moduleSpecifier: `${RUNTIME_PACKAGE}`,
    });

    // import enums
    const prismaImport = getPrismaClientImportSpec(model, output);
    for (const e of model.declarations.filter(d => isEnum(d))) {
      sf.addImportDeclaration({
        namedImports: [{ name: e.name }],
        moduleSpecifier: prismaImport,
      });
    }

    const models = getDataModels(model);

    const policyMap: Record<
      string,
      Record<string, string | boolean | object>
    > = {};
    for (const model of models) {
      policyMap[model.name] = await this.generateQueryGuardForModel(model, sf);
    }

    sf.addVariableStatement({
      declarationKind: VariableDeclarationKind.Const,
      declarations: [
        {
          name: "policy",
          initializer: writer => {
            writer.block(() => {
              writer.write("guard:");
              writer.inlineBlock(() => {
                for (const [model, map] of Object.entries(policyMap)) {
                  writer.write(`${lowerCaseFirst(model)}:`);
                  writer.inlineBlock(() => {
                    for (const [op, func] of Object.entries(map)) {
                      if (typeof func === "object") {
                        writer.write(`${op}: ${JSON.stringify(func)},`);
                      } else {
                        writer.write(`${op}: ${func},`);
                      }
                    }
                  });
                  writer.write(",");
                }
              });
              writer.writeLine(",");

              writer.write("validation:");
              writer.inlineBlock(() => {
                for (const model of models) {
                  writer.write(`${lowerCaseFirst(model.name)}:`);
                  writer.inlineBlock(() => {
                    writer.write(
                      `hasValidation: ${hasValidationAttributes(model)}`
                    );
                  });
                  writer.writeLine(",");
                }
              });
            });
          },
        },
      ],
    });

    sf.addStatements("export default policy");

    const shouldCompile = options.compile !== false;
    if (!shouldCompile || options.preserveTsFiles === true) {
      // save ts files
      await saveProject(project);
    }
    if (shouldCompile) {
      await emitProject(project);
    }
  }

  private getPolicyExpressions(
    model: DataModel,
    kind: PolicyKind,
    operation: PolicyOperationKind
  ) {
    const attrs = model.attributes.filter(
      attr => attr.decl.ref?.name === `@@${kind}`
    );

    const checkOperation = operation === "postUpdate" ? "update" : operation;

    let result = attrs
      .filter(attr => {
        const opsValue = getLiteral<string>(attr.args[0].value);
        if (!opsValue) {
          return false;
        }
        const ops = opsValue.split(",").map(s => s.trim());
        return ops.includes(checkOperation) || ops.includes("all");
      })
      .map(attr => attr.args[1].value);

    if (operation === "update") {
      result = this.processUpdatePolicies(result, false);
    } else if (operation === "postUpdate") {
      result = this.processUpdatePolicies(result, true);
    }

    return result;
  }

  private processUpdatePolicies(
    expressions: Expression[],
    postUpdate: boolean
  ) {
    return expressions
      .map(expr => this.visitPolicyExpression(expr, postUpdate))
      .filter((e): e is Expression => !!e);
  }

  private visitPolicyExpression(
    expr: Expression,
    postUpdate: boolean
  ): Expression | undefined {
    if (
      isBinaryExpr(expr) &&
      (expr.operator === "&&" || expr.operator === "||")
    ) {
      const left = this.visitPolicyExpression(expr.left, postUpdate);
      const right = this.visitPolicyExpression(expr.right, postUpdate);
      if (!left) return right;
      if (!right) return left;
      return { ...expr, left, right };
    }

    if (isUnaryExpr(expr) && expr.operator === "!") {
      const operand = this.visitPolicyExpression(expr.operand, postUpdate);
      if (!operand) return undefined;
      return { ...expr, operand };
    }

    if (postUpdate && !this.hasFutureReference(expr)) {
      return undefined;
    } else if (!postUpdate && this.hasFutureReference(expr)) {
      return undefined;
    }

    return expr;
  }

  private hasFutureReference(expr: Expression) {
    for (const node of this.allNodes(expr)) {
      if (
        isInvocationExpr(node) &&
        node.function.ref?.name === "future" &&
        isFromStdlib(node.function.ref)
      ) {
        return true;
      }
    }
    return false;
  }

  private async generateQueryGuardForModel(
    model: DataModel,
    sourceFile: SourceFile
  ) {
    const result: Record<string, string | boolean | object> = {};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const policies: any = analyzePolicies(model);

    for (const kind of ALL_OPERATION_KINDS) {
      if (policies[kind] === true || policies[kind] === false) {
        result[kind] = policies[kind];
        if (kind === "create") {
          result[kind + "_input"] = policies[kind];
        }
        continue;
      }

      const denies = this.getPolicyExpressions(model, "deny", kind);
      const allows = this.getPolicyExpressions(model, "allow", kind);

      if (kind === "update" && allows.length === 0) {
        // no allow rule for 'update', policy is constant based on if there's
        // post-update counterpart
        if (
          this.getPolicyExpressions(model, "allow", "postUpdate").length === 0
        ) {
          result[kind] = false;
          continue;
        } else {
          result[kind] = true;
          continue;
        }
      }

      if (kind === "postUpdate" && allows.length === 0 && denies.length === 0) {
        // no rule 'postUpdate', always allow
        result[kind] = true;
        continue;
      }

      const guardFunc = this.generateQueryGuardFunction(
        sourceFile,
        model,
        kind,
        allows,
        denies
      );
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      result[kind] = guardFunc.getName()!;

      if (kind === "postUpdate") {
        const preValueSelect = this.generatePreValueSelect(
          model,
          allows,
          denies
        );
        if (preValueSelect) {
          result["preValueSelect"] = preValueSelect;
        }
      }

      if (
        kind === "create" &&
        this.canCheckCreateBasedOnInput(model, allows, denies)
      ) {
        const inputCheckFunc = this.generateInputCheckFunction(
          sourceFile,
          model,
          kind,
          allows,
          denies
        );
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        result[kind + "_input"] = inputCheckFunc.getName()!;
      }
    }
    return result;
  }

  private canCheckCreateBasedOnInput(
    model: DataModel,
    allows: Expression[],
    denies: Expression[]
  ) {
    return [...allows, ...denies].every(rule => {
      return [...this.allNodes(rule)].every(expr => {
        if (isThisExpr(expr)) {
          return false;
        }
        if (isReferenceExpr(expr)) {
          if (isDataModel(expr.$resolvedType?.decl)) {
            // if policy rules uses relation fields,
            // we can't check based on create input
            return false;
          }
          if (
            isDataModelField(expr.target.ref) &&
            expr.target.ref.$container === model &&
            hasAttribute(expr.target.ref, "@default")
          ) {
            // reference to field of current model
            // if it has default value, we can't check
            // based on create input
            return false;
          }
        }

        return true;
      });
    });
  }

  // generates an object that can be used as the 'select' argument when fetching pre-update
  // entity value
  private generatePreValueSelect(
    model: DataModel,
    allows: Expression[],
    denies: Expression[]
  ): object {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = {};
    const addPath = (path: string[]) => {
      let curr = result;
      path.forEach((seg, i) => {
        if (i === path.length - 1) {
          curr[seg] = true;
        } else {
          if (!curr[seg]) {
            curr[seg] = { select: {} };
          }
          curr = curr[seg].select;
        }
      });
    };

    const visit = (node: Expression): string[] | undefined => {
      if (isReferenceExpr(node)) {
        const target = resolved(node.target);
        if (isDataModelField(target)) {
          // a field selection, it's a terminal
          return [target.name];
        }
      } else if (isMemberAccessExpr(node)) {
        if (isFutureExpr(node.operand)) {
          // future().field is not subject to pre-update select
          return undefined;
        }

        // build a selection path inside-out for chained member access
        const inner = visit(node.operand);
        if (inner) {
          return [...inner, node.member.$refText];
        }
      }
      return undefined;
    };

    for (const rule of [...allows, ...denies]) {
      for (const expr of [...this.allNodes(rule)].filter(
        (node): node is Expression => isExpression(node)
      )) {
        // only care about member access and reference expressions
        if (!isMemberAccessExpr(expr) && !isReferenceExpr(expr)) {
          continue;
        }

        if (expr.$container.$type === MemberAccessExpr) {
          // only visit top-level member access
          continue;
        }

        const path = visit(expr);
        if (path) {
          if (isDataModel(expr.$resolvedType?.decl)) {
            // member selection ended at a data model field, include its 'id'
            path.push("id");
          }
          addPath(path);
        }
      }
    }

    return Object.keys(result).length === 0 ? null : result;
  }

  private generateQueryGuardFunction(
    sourceFile: SourceFile,
    model: DataModel,
    kind: PolicyOperationKind,
    allows: Expression[],
    denies: Expression[]
  ): FunctionDeclaration {
    const statements: (string | WriterFunction | StatementStructures)[] = [];

    // check if any allow or deny rule contains 'auth()' invocation
    const hasAuthRef = [...denies, ...allows].some(rule =>
      [...this.allNodes(rule)].some(child => isAuthInvocation(child))
    );

    if (hasAuthRef) {
      const userModel = model.$container.declarations.find(
        (decl): decl is DataModel => isDataModel(decl) && decl.name === "User"
      );
      if (!userModel) {
        throw new PluginError(name, "User model not found");
      }
      const userIdFields = getIdFields(userModel);
      if (!userIdFields || userIdFields.length === 0) {
        throw new PluginError(name, "User model does not have an id field");
      }

      // normalize user to null to avoid accidentally use undefined in filter
      statements.push(
        `const user = hasAllFields(context.user, [${userIdFields
          .map(f => "'" + f.name + "'")
          .join(", ")}]) ? context.user as any : null;`
      );
    }

    const hasFieldAccess = [...denies, ...allows].some(rule =>
      [...this.allNodes(rule)].some(
        child =>
          // this.???
          isThisExpr(child) ||
          // future().???
          isFutureExpr(child) ||
          // field reference
          (isReferenceExpr(child) && isDataModelField(child.target.ref))
      )
    );

    if (!hasFieldAccess) {
      // none of the rules reference model fields, we can compile down to a plain boolean
      // function in this case (so we can skip doing SQL queries when validating)
      statements.push(writer => {
        const transformer = new TypeScriptExpressionTransformer({
          context: ExpressionContext.AccessPolicy,
          isPostGuard: kind === "postUpdate",
        });
        try {
          denies.forEach(rule => {
            writer.write(
              `if (${transformer.transform(rule, false)}) { return ${FALSE}; }`
            );
          });
          allows.forEach(rule => {
            writer.write(
              `if (${transformer.transform(rule, false)}) { return ${TRUE}; }`
            );
          });
        } catch (err) {
          if (err instanceof TypeScriptExpressionTransformerError) {
            throw new PluginError(name, err.message);
          } else {
            throw err;
          }
        }
        writer.write(`return ${FALSE};`);
      });
    } else {
      statements.push(writer => {
        writer.write("return ");
        const exprWriter = new ExpressionWriter(writer, kind === "postUpdate");
        const writeDenies = () => {
          writer.conditionalWrite(denies.length > 1, "{ AND: [");
          denies.forEach((expr, i) => {
            writer.inlineBlock(() => {
              writer.write("NOT: ");
              exprWriter.write(expr);
            });
            writer.conditionalWrite(i !== denies.length - 1, ",");
          });
          writer.conditionalWrite(denies.length > 1, "]}");
        };

        const writeAllows = () => {
          writer.conditionalWrite(allows.length > 1, "{ OR: [");
          allows.forEach((expr, i) => {
            exprWriter.write(expr);
            writer.conditionalWrite(i !== allows.length - 1, ",");
          });
          writer.conditionalWrite(allows.length > 1, "]}");
        };

        if (allows.length > 0 && denies.length > 0) {
          writer.write("{ AND: [");
          writeDenies();
          writer.write(",");
          writeAllows();
          writer.write("]}");
        } else if (denies.length > 0) {
          writeDenies();
        } else if (allows.length > 0) {
          writeAllows();
        } else {
          // disallow any operation
          writer.write(`{ OR: [] }`);
        }
        writer.write(";");
      });
    }

    const func = sourceFile.addFunction({
      name: model.name + "_" + kind,
      returnType: "any",
      parameters: [
        {
          name: "context",
          type: "QueryContext",
        },
      ],
      statements,
    });

    return func;
  }

  private generateInputCheckFunction(
    sourceFile: SourceFile,
    model: DataModel,
    kind: "create" | "update",
    allows: Expression[],
    denies: Expression[]
  ): FunctionDeclaration {
    const statements: (string | WriterFunction | StatementStructures)[] = [];

    // check if any allow or deny rule contains 'auth()' invocation
    const hasAuthRef = [...denies, ...allows].some(rule =>
      [...this.allNodes(rule)].some(child => isAuthInvocation(child))
    );

    if (hasAuthRef) {
      const userModel = model.$container.declarations.find(
        (decl): decl is DataModel => isDataModel(decl) && decl.name === "User"
      );
      if (!userModel) {
        throw new PluginError(name, "User model not found");
      }
      const userIdFields = getIdFields(userModel);
      if (!userIdFields || userIdFields.length === 0) {
        throw new PluginError(name, "User model does not have an id field");
      }

      // normalize user to null to avoid accidentally use undefined in filter
      statements.push(
        `const user = hasAllFields(context.user, [${userIdFields
          .map(f => "'" + f.name + "'")
          .join(", ")}]) ? context.user as any : null;`
      );
    }

    statements.push(writer => {
      if (allows.length === 0) {
        writer.write("return false;");
        return;
      }

      const transformer = new TypeScriptExpressionTransformer({
        context: ExpressionContext.AccessPolicy,
        fieldReferenceContext: "input",
      });

      let expr =
        denies.length > 0
          ? "!(" +
            denies
              .map(deny => {
                return transformer.transform(deny);
              })
              .join(" || ") +
            ")"
          : undefined;

      const allowStmt = allows
        .map(allow => {
          return transformer.transform(allow);
        })
        .join(" || ");

      expr = expr ? `${expr} && (${allowStmt})` : allowStmt;
      writer.write("return " + expr);
    });

    const func = sourceFile.addFunction({
      name: model.name + "_" + kind + "_input",
      returnType: "boolean",
      parameters: [
        {
          name: "input",
          type: "any",
        },
        {
          name: "context",
          type: "QueryContext",
        },
      ],
      statements,
    });

    return func;
  }

  private *allNodes(expr: Expression) {
    yield expr;
    yield* streamAllContents(expr);
  }
}
