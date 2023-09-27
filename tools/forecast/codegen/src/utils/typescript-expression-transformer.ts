/* eslint-disable no-useless-escape */
import {
  ArrayExpr,
  BinaryExpr,
  Expression,
  InvocationExpr,
  isEnumField,
  isThisExpr,
  LiteralExpr,
  MemberAccessExpr,
  NullExpr,
  ReferenceExpr,
  ThisExpr,
  UnaryExpr
} from "@stormstack/tools-forecast-language/ast";
import { ExpressionContext } from "../constants";
import { isFromStdlib } from "../language-server/utils";
import { isFutureExpr } from "../plugins/access-policy/utils";
import { getLiteral } from "../sdk";

export class TypeScriptExpressionTransformerError extends Error {
  constructor(message: string) {
    super(message);
  }
}

type Options = {
  isPostGuard?: boolean;
  fieldReferenceContext?: string;
  context: ExpressionContext;
};

// a registry of function handlers marked with @func
const functionHandlers = new Map<string, PropertyDescriptor>();

// function handler decorator
function func(name: string) {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    if (!functionHandlers.get(name)) {
      functionHandlers.set(name, descriptor);
    }
    return descriptor;
  };
}

/**
 * Transforms Storm expression to plain TypeScript expression.
 */
export class TypeScriptExpressionTransformer {
  /**
   * Constructs a new TypeScriptExpressionTransformer.
   *
   * @param isPostGuard indicates if we're writing for post-update conditions
   */
  constructor(private readonly options?: Options) {}

  /**
   * Transforms the given expression to a TypeScript expression.
   * @param normalizeUndefined if undefined values should be normalized to null
   * @returns
   */
  transform(expr: Expression, normalizeUndefined = true): string {
    switch (expr.$type) {
      case LiteralExpr:
        return this.literal(expr as LiteralExpr);

      case ArrayExpr:
        return this.array(expr as ArrayExpr, normalizeUndefined);

      case NullExpr:
        return this.null();

      case ThisExpr:
        return this.this(expr as ThisExpr);

      case ReferenceExpr:
        return this.reference(expr as ReferenceExpr);

      case InvocationExpr:
        return this.invocation(expr as InvocationExpr, normalizeUndefined);

      case MemberAccessExpr:
        return this.memberAccess(expr as MemberAccessExpr, normalizeUndefined);

      case UnaryExpr:
        return this.unary(expr as UnaryExpr, normalizeUndefined);

      case BinaryExpr:
        return this.binary(expr as BinaryExpr, normalizeUndefined);

      default:
        throw new TypeScriptExpressionTransformerError(
          `Unsupported expression type: ${expr.$type}`
        );
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private this(expr: ThisExpr) {
    // "this" is mapped to id comparison
    return "id";
  }

  private memberAccess(expr: MemberAccessExpr, normalizeUndefined: boolean) {
    if (!expr.member.ref) {
      throw new TypeScriptExpressionTransformerError(
        `Unresolved MemberAccessExpr`
      );
    }

    if (isThisExpr(expr.operand)) {
      return expr.member.ref.name;
    } else if (isFutureExpr(expr.operand)) {
      if (this.options?.isPostGuard !== true) {
        throw new TypeScriptExpressionTransformerError(
          `future() is only supported in postUpdate rules`
        );
      }
      return expr.member.ref.name;
    } else {
      if (normalizeUndefined) {
        // normalize field access to null instead of undefined to avoid accidentally use undefined in filter
        return `(${this.transform(expr.operand, normalizeUndefined)}?.${
          expr.member.ref.name
        } ?? null)`;
      } else {
        return `${this.transform(expr.operand, normalizeUndefined)}?.${
          expr.member.ref.name
        }`;
      }
    }
  }

  private invocation(expr: InvocationExpr, normalizeUndefined: boolean) {
    if (!expr.function.ref) {
      throw new TypeScriptExpressionTransformerError(
        `Unresolved InvocationExpr`
      );
    }

    const funcName = expr.function.ref.name;
    const isStdFunc = isFromStdlib(expr.function.ref);

    if (!isStdFunc) {
      throw new TypeScriptExpressionTransformerError(
        "User-defined functions are not supported yet"
      );
    }

    const handler = functionHandlers.get(funcName);
    if (!handler) {
      throw new TypeScriptExpressionTransformerError(
        `Unsupported function: ${funcName}`
      );
    }

    const args = expr.args.map(arg => arg.value);
    return handler.value.call(this, args, normalizeUndefined);
  }

  // #region function invocation handlers

  // arguments have been type-checked

  @func("auth")
  private _auth() {
    return "user";
  }

  @func("now")
  private _now() {
    return `(new Date())`;
  }

  @func("length")
  private _length(args: Expression[]) {
    const field = this.transform(args[0], false);
    const min = getLiteral<number>(args[1]);
    const max = getLiteral<number>(args[2]);
    let result: string;
    if (min === undefined) {
      result = `(${field}?.length > 0)`;
    } else if (max === undefined) {
      result = `(${field}?.length >= ${min})`;
    } else {
      result = `(${field}?.length >= ${min} && ${field}?.length <= ${max})`;
    }
    return this.ensureBoolean(result);
  }

  @func("contains")
  private _contains(args: Expression[], normalizeUndefined: boolean) {
    const field = this.transform(args[0], false);
    const caseInsensitive = getLiteral<boolean>(args[2]) === true;
    let result: string;
    if (caseInsensitive) {
      result = `${field}?.toLowerCase().includes(${this.transform(
        args[1],
        normalizeUndefined
      )}?.toLowerCase())`;
    } else {
      result = `${field}?.includes(${this.transform(
        args[1],
        normalizeUndefined
      )})`;
    }
    return this.ensureBoolean(result);
  }

  @func("startsWith")
  private _startsWith(args: Expression[], normalizeUndefined: boolean) {
    const field = this.transform(args[0], false);
    const result = `${field}?.startsWith(${this.transform(
      args[1],
      normalizeUndefined
    )})`;
    return this.ensureBoolean(result);
  }

  @func("endsWith")
  private _endsWith(args: Expression[], normalizeUndefined: boolean) {
    const field = this.transform(args[0], false);
    const result = `${field}?.endsWith(${this.transform(
      args[1],
      normalizeUndefined
    )})`;
    return this.ensureBoolean(result);
  }

  @func("regex")
  private _regex(args: Expression[]) {
    const field = this.transform(args[0], false);
    const pattern = getLiteral<string>(args[1]);
    return `new RegExp(${JSON.stringify(pattern)}).test(${field})`;
  }

  @func("email")
  private _email(args: Expression[]) {
    const field = this.transform(args[0], false);
    return `z.string().email().safeParse(${field}).success`;
  }

  @func("phoneNumber")
  private _phoneNumber(args: Expression[]) {
    const field = this.transform(args[0], false);
    return `z.string().regex(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/).safeParse(${field}).success`;
  }

  @func("semver")
  private _semver(args: Expression[]) {
    const field = this.transform(args[0], false);
    return `z.string().regex(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/).safeParse(${field}).success`;
  }

  @func("postalCode")
  private _postalCode(args: Expression[]) {
    const field = this.transform(args[0], false);
    return `z.string().regex(/^[0-9]{5}(?:-[0-9]{4})?$/).safeParse(${field}).success`;
  }

  @func("latitude")
  private _latitude(args: Expression[]) {
    const field = this.transform(args[0], false);
    return `z.string().regex(/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)/).safeParse(${field}).success`;
  }

  @func("longitude")
  private _longitude(args: Expression[]) {
    const field = this.transform(args[0], false);
    return `z.string().regex(/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)/).safeParse(${field}).success`;
  }

  @func("countryCode")
  private _countryCode(args: Expression[]) {
    const field = this.transform(args[0], false);
    return `z.string().regex(/^(A(D|E|F|G|I|L|M|N|O|R|S|T|Q|U|W|X|Z)|B(A|B|D|E|F|G|H|I|J|L|M|N|O|R|S|T|V|W|Y|Z)|C(A|C|D|F|G|H|I|K|L|M|N|O|R|U|V|X|Y|Z)|D(E|J|K|M|O|Z)|E(C|E|G|H|R|S|T)|F(I|J|K|M|O|R)|G(A|B|D|E|F|G|H|I|L|M|N|P|Q|R|S|T|U|W|Y)|H(K|M|N|R|T|U)|I(D|E|Q|L|M|N|O|R|S|T)|J(E|M|O|P)|K(E|G|H|I|M|N|P|R|W|Y|Z)|L(A|B|C|I|K|R|S|T|U|V|Y)|M(A|C|D|E|F|G|H|K|L|M|N|O|Q|P|R|S|T|U|V|W|X|Y|Z)|N(A|C|E|F|G|I|L|O|P|R|U|Z)|OM|P(A|E|F|G|H|K|L|M|N|R|S|T|W|Y)|QA|R(E|O|S|U|W)|S(A|B|C|D|E|G|H|I|J|K|L|M|N|O|R|T|V|Y|Z)|T(C|D|F|G|H|J|K|L|M|N|O|R|T|V|W|Z)|U(A|G|M|S|Y|Z)|V(A|C|E|G|I|N|U)|W(F|S)|Y(E|T)|Z(A|M|W))$/).safeParse(${field}).success`;
  }

  @func("timeZone")
  private _timeZone(args: Expression[]) {
    const field = this.transform(args[0], false);
    return `z.string().length(2).safeParse(${field}).success`;
  }

  @func("ip")
  private _ip(args: Expression[]) {
    const field = this.transform(args[0], false);
    return `z.string().ip().safeParse(${field}).success`;
  }

  @func("mac")
  private _mac(args: Expression[]) {
    const field = this.transform(args[0], false);
    return `z.string().regex(/^(?:[0-9A-Fa-f]{2}[:-]){5}(?:[0-9A-Fa-f]{2})$/).safeParse(${field}).success`;
  }

  @func("datetime")
  private _datetime(args: Expression[]) {
    const field = this.transform(args[0], false);
    return `z.string().datetime({ offset: true }).safeParse(${field}).success`;
  }

  @func("url")
  private _url(args: Expression[]) {
    const field = this.transform(args[0], false);
    return `z.string().url().safeParse(${field}).success`;
  }

  @func("has")
  private _has(args: Expression[], normalizeUndefined: boolean) {
    const field = this.transform(args[0], false);
    const result = `${field}?.includes(${this.transform(
      args[1],
      normalizeUndefined
    )})`;
    return this.ensureBoolean(result);
  }

  @func("hasEvery")
  private _hasEvery(args: Expression[], normalizeUndefined: boolean) {
    const field = this.transform(args[0], false);
    const result = `${this.transform(
      args[1],
      normalizeUndefined
    )}?.every((item) => ${field}?.includes(item))`;
    return this.ensureBoolean(result);
  }

  @func("hasSome")
  private _hasSome(args: Expression[], normalizeUndefined: boolean) {
    const field = this.transform(args[0], false);
    const result = `${this.transform(
      args[1],
      normalizeUndefined
    )}?.some((item) => ${field}?.includes(item))`;
    return this.ensureBoolean(result);
  }

  @func("isEmpty")
  private _isEmpty(args: Expression[]) {
    const field = this.transform(args[0], false);
    const result = `(!${field} || ${field}?.length === 0)`;
    return this.ensureBoolean(result);
  }

  private ensureBoolean(expr: string) {
    return `(${expr} ?? false)`;
  }

  // #endregion

  private reference(expr: ReferenceExpr) {
    if (!expr.target.ref) {
      throw new TypeScriptExpressionTransformerError(
        `Unresolved ReferenceExpr`
      );
    }

    if (isEnumField(expr.target.ref)) {
      return `${expr.target.ref.$container.name}.${expr.target.ref.name}`;
    } else {
      if (this.options?.isPostGuard) {
        // if we're processing post-update, any direct field access should be
        // treated as access to context.preValue, which is entity's value before
        // the update
        return `context.preValue?.${expr.target.ref.name}`;
      } else {
        return this.options?.fieldReferenceContext
          ? `${this.options.fieldReferenceContext}?.${expr.target.ref.name}`
          : expr.target.ref.name;
      }
    }
  }

  private null() {
    return "null";
  }

  private array(expr: ArrayExpr, normalizeUndefined: boolean) {
    return `[${expr.items
      .map(item => this.transform(item, normalizeUndefined))
      .join(", ")}]`;
  }

  private literal(expr: LiteralExpr) {
    if (typeof expr.value === "string") {
      return `'${expr.value}'`;
    } else {
      return expr.value.toString();
    }
  }

  private unary(expr: UnaryExpr, normalizeUndefined: boolean): string {
    return `(${expr.operator} ${this.transform(
      expr.operand,
      normalizeUndefined
    )})`;
  }

  private binary(expr: BinaryExpr, normalizeUndefined: boolean): string {
    if (expr.operator === "in") {
      return `(${this.transform(expr.right, false)}?.includes(${this.transform(
        expr.left,
        normalizeUndefined
      )}) ?? false)`;
    } else {
      return `(${this.transform(expr.left, normalizeUndefined)} ${
        expr.operator
      } ${this.transform(expr.right, normalizeUndefined)})`;
    }
  }
}
