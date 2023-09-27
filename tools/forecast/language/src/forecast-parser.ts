import { LangiumParser, LangiumServices } from "langium";
import { createParser } from "langium/lib/parser/parser-builder-base";

/**
 * Create and finalize a Langium parser. The parser rules are derived from the grammar, which is
 * available at `services.Grammar`.
 */
export function createForecastParser(services: LangiumServices): LangiumParser {
  const parser = prepareForecastParser(services);
  parser.finalize();

  return parser;
}

/**
 * Create a Langium parser without finalizing it. This is used to extract more detailed error
 * information when the parser is initially validated.
 */
export function prepareForecastParser(
  services: LangiumServices
): LangiumParser {
  const grammar = services.Grammar;
  const lexer = services.parser.Lexer;

  services.parser.ParserConfig = { maxLookahead: 3 };
  const parser = new LangiumParser(services);

  return createParser(grammar, parser, lexer.definition);
}
