import { LangiumParser, LangiumServices } from "langium";
/*import { ParserRule } from "langium/lib/grammar/generated/ast";
import {
  getTypeName,
  isOperationGroupRule,
  withRuleSuffix,
} from "langium/src/grammar/internal-grammar-util";*/
import { createParser } from "langium/lib/parser/parser-builder-base";

/*export class StormParser extends LangiumParser implements BaseParser {
  #mainRule!: RuleResult;

  constructor(services: LangiumServices) {
    super(services);
  }

  public override parse<T extends AstNode = AstNode>(
    input: string
  ): ParseResult<T> {
    this.nodeBuilder.buildRootNode(input);
    const lexerResult = this.lexer.tokenize(input);
    this.wrapper.input = lexerResult.tokens;
    const result = this.#mainRule.call(this.wrapper, {});
    this.nodeBuilder.addHiddenTokens(lexerResult.hidden);
    this.unorderedGroups.clear();
    return {
      value: result,
      lexerErrors: lexerResult.errors,
      parserErrors: this.wrapper.errors,
    };
  }

  public override rule(rule: ParserRule, impl: RuleImpl): RuleResult {
    const type = rule.fragment
      ? undefined
      : isOperationGroupRule(rule)
      ? DatatypeSymbol
      : getTypeName(rule);
    const ruleMethod = this.wrapper.DEFINE_RULE(
      withRuleSuffix(rule.name),
      this.startImplementation(type, impl).bind(this)
    );
    if (rule.entry) {
      this.#mainRule = ruleMethod;
    }
    return ruleMethod;
  }

  private startImplementation(
    $type: string | symbol | undefined,
    implementation: RuleImpl
  ): RuleImpl {
    return args => {
      if (!this.isRecording()) {
        const node: any = { $type };
        this.stack.push(node);
        if ($type === DatatypeSymbol) {
          node.value = "";
        }
      }
      let result: unknown;
      try {
        result = implementation(args);
      } catch (err) {
        result = undefined;
      }
      if (!this.isRecording() && result === undefined) {
        result = this.construct();
      }
      return result;
    };
  }
}*/

/**
 * Create and finalize a Langium parser. The parser rules are derived from the grammar, which is
 * available at `services.Grammar`.
 */
export function createStormParser(services: LangiumServices): LangiumParser {
  const parser = prepareStormParser(services);
  parser.finalize();

  return parser;
}

/**
 * Create a Langium parser without finalizing it. This is used to extract more detailed error
 * information when the parser is initially validated.
 */
export function prepareStormParser(services: LangiumServices): LangiumParser {
  const grammar = services.Grammar;
  const lexer = services.parser.Lexer;

  services.parser.ParserConfig = { maxLookahead: 3 };
  const parser = new LangiumParser(services);

  return createParser(grammar, parser, lexer.definition);
}
