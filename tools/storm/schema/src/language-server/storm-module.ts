/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  StormGeneratedModule,
  StormGeneratedSharedModule
} from "@stormstack/tools-storm-language/module";
import {
  DefaultAstNodeDescriptionProvider,
  DefaultAstNodeLocator,
  DefaultCompletionProvider,
  DefaultConfigurationProvider,
  DefaultDefinitionProvider,
  DefaultDocumentBuilder,
  DefaultDocumentHighlightProvider,
  DefaultDocumentSymbolProvider,
  DefaultDocumentValidator,
  DefaultFoldingRangeProvider,
  DefaultIndexManager,
  DefaultJsonSerializer,
  DefaultLangiumDocumentFactory,
  DefaultLangiumDocuments,
  DefaultLanguageServer,
  DefaultLexer,
  DefaultLinker,
  DefaultModuleContext,
  DefaultNameProvider,
  DefaultReferenceDescriptionProvider,
  DefaultReferences,
  DefaultReferencesProvider,
  DefaultRenameProvider,
  DefaultScopeComputation,
  DefaultScopeProvider,
  DefaultServiceRegistry,
  DefaultSharedModuleContext,
  DefaultTokenBuilder,
  DefaultValueConverter,
  JSDocDocumentationProvider,
  LangiumDefaultServices,
  LangiumDefaultSharedServices,
  LangiumServices,
  LangiumSharedServices,
  Module,
  MultilineCommentHoverProvider,
  MutexLock,
  PartialLangiumServices,
  ValidationRegistry,
  createCompletionParser,
  createGrammarConfig,
  inject
} from "langium";
import { TextDocuments } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import { StormCodeActionProvider } from "./storm-code-action";
import { StormDefinitionProvider } from "./storm-definition";
import { StormFormatter } from "./storm-formatter";
import { StormLinker } from "./storm-linker";
import { createStormParser } from "./storm-parser";
import { StormScopeComputation, StormScopeProvider } from "./storm-scope";
import StormWorkspaceManager from "./storm-workspace-manager";
import {
  StormValidationRegistry,
  StormValidator
} from "./validator/storm-validator";

/**
 * Declaration of custom services - add your own service classes here.
 */
export type StormAddedServices = {
  validation: {
    StormValidator: StormValidator;
  };
};

/**
 * Union of Langium default services and your custom services - use this as constructor parameter
 * of custom service classes.
 */
export type StormServices = LangiumServices & StormAddedServices;

/**
 * Dependency injection module that overrides Langium default services and contributes the
 * declared custom services. The Langium defaults can be partially specified to override only
 * selected services, while the custom services must be fully specified.
 */
export const StormModule: Module<
  StormServices,
  PartialLangiumServices & StormAddedServices
> = {
  references: {
    ScopeComputation: services => new StormScopeComputation(services),
    Linker: services => new StormLinker(services),
    ScopeProvider: services => new StormScopeProvider(services)
  },
  validation: {
    ValidationRegistry: services => new StormValidationRegistry(services),
    StormValidator: services => new StormValidator(services)
  },
  lsp: {
    Formatter: () => new StormFormatter(),
    CodeActionProvider: services => new StormCodeActionProvider(services),
    DefinitionProvider: services => new StormDefinitionProvider(services)
  }
};

// this duplicates createDefaultSharedModule except that a custom WorkspaceManager is used
export function createSharedModule(
  context: DefaultSharedModuleContext
): Module<LangiumSharedServices, LangiumDefaultSharedServices> {
  return {
    ServiceRegistry: () => new DefaultServiceRegistry(),
    lsp: {
      Connection: () => context.connection,
      LanguageServer: services => new DefaultLanguageServer(services)
    },
    workspace: {
      LangiumDocuments: services => new DefaultLangiumDocuments(services),
      LangiumDocumentFactory: services =>
        new DefaultLangiumDocumentFactory(services),
      DocumentBuilder: services => new DefaultDocumentBuilder(services),
      TextDocuments: _services => new TextDocuments(TextDocument),
      IndexManager: services => new DefaultIndexManager(services),
      WorkspaceManager: services => new StormWorkspaceManager(services),
      FileSystemProvider: services => context.fileSystemProvider(services),
      MutexLock: () => new MutexLock(),
      ConfigurationProvider: services =>
        new DefaultConfigurationProvider(services)
    }
  };
}

/*export function createDefaultModule(context: DefaultModuleContext) {
  return {
    documentation: {
      DocumentationProvider: services =>
        new JSDocDocumentationProvider(services),
    },
    parser: {
      GrammarConfig: services => createGrammarConfig(services),
      LangiumParser: services => createLangiumParser(services),
      CompletionParser: services => createCompletionParser(services),
      ValueConverter: () => new DefaultValueConverter(),
      TokenBuilder: () => new DefaultTokenBuilder(),
      Lexer: services => new DefaultLexer(services),
    },
    lsp: {
      CompletionProvider: services => new DefaultCompletionProvider(services),
      DocumentSymbolProvider: services =>
        new DefaultDocumentSymbolProvider(services),
      HoverProvider: services => new MultilineCommentHoverProvider(services),
      FoldingRangeProvider: services =>
        new DefaultFoldingRangeProvider(services),
      ReferencesProvider: services => new DefaultReferencesProvider(services),
      DefinitionProvider: services => new DefaultDefinitionProvider(services),
      DocumentHighlightProvider: services =>
        new DefaultDocumentHighlightProvider(services),
      RenameProvider: services => new DefaultRenameProvider(services),
    },
    workspace: {
      AstNodeLocator: () => new DefaultAstNodeLocator(),
      AstNodeDescriptionProvider: services =>
        new DefaultAstNodeDescriptionProvider(services),
      ReferenceDescriptionProvider: services =>
        new DefaultReferenceDescriptionProvider(services),
    },
    references: {
      Linker: services => new DefaultLinker(services),
      NameProvider: () => new DefaultNameProvider(),
      ScopeProvider: services => new DefaultScopeProvider(services),
      ScopeComputation: services => new DefaultScopeComputation(services),
      References: services => new DefaultReferences(services),
    },
    serializer: {
      JsonSerializer: services => new DefaultJsonSerializer(services),
    },
    validation: {
      DocumentValidator: services => new DefaultDocumentValidator(services),
      ValidationRegistry: services => new ValidationRegistry(services),
    },
    shared: () => context.shared,
  };
}*/

export function createDefaultModule(
  context: DefaultModuleContext
): Module<LangiumServices, LangiumDefaultServices> {
  return {
    documentation: {
      DocumentationProvider: services =>
        new JSDocDocumentationProvider(services)
    },
    parser: {
      GrammarConfig: services => createGrammarConfig(services),
      LangiumParser: services => createStormParser(services),
      CompletionParser: services => createCompletionParser(services),
      ValueConverter: () => new DefaultValueConverter(),
      TokenBuilder: () => new DefaultTokenBuilder(),
      Lexer: services => new DefaultLexer(services)
    },
    lsp: {
      CompletionProvider: services => new DefaultCompletionProvider(services),
      DocumentSymbolProvider: services =>
        new DefaultDocumentSymbolProvider(services),
      HoverProvider: services => new MultilineCommentHoverProvider(services),
      FoldingRangeProvider: services =>
        new DefaultFoldingRangeProvider(services),
      ReferencesProvider: services => new DefaultReferencesProvider(services),
      DefinitionProvider: services => new DefaultDefinitionProvider(services),
      DocumentHighlightProvider: services =>
        new DefaultDocumentHighlightProvider(services),
      RenameProvider: services => new DefaultRenameProvider(services)
    },
    workspace: {
      AstNodeLocator: () => new DefaultAstNodeLocator(),
      AstNodeDescriptionProvider: services =>
        new DefaultAstNodeDescriptionProvider(services),
      ReferenceDescriptionProvider: services =>
        new DefaultReferenceDescriptionProvider(services)
    },
    references: {
      Linker: services => new DefaultLinker(services),
      NameProvider: () => new DefaultNameProvider(),
      ScopeProvider: services => new DefaultScopeProvider(services),
      ScopeComputation: services => new DefaultScopeComputation(services),
      References: services => new DefaultReferences(services)
    },
    serializer: {
      JsonSerializer: services => new DefaultJsonSerializer(services)
    },
    validation: {
      DocumentValidator: services => new DefaultDocumentValidator(services),
      ValidationRegistry: services => new ValidationRegistry(services)
    },
    shared: () => context.shared
  };
}

/**
 * Create the full set of services required by Langium.
 *
 * First inject the shared services by merging two modules:
 *  - Langium default shared services
 *  - Services generated by langium-cli
 *
 * Then inject the language-specific services by merging three modules:
 *  - Langium default language-specific services
 *  - Services generated by langium-cli
 *  - Services specified in this file
 *
 * @param context Optional module context with the LSP connection
 * @returns An object wrapping the shared services and the language-specific services
 */
export function createStormServices(context: DefaultSharedModuleContext): {
  shared: LangiumSharedServices;
  Storm: StormServices;
} {
  const shared = inject(
    createSharedModule(context),
    StormGeneratedSharedModule
  );

  const Storm = inject(
    createDefaultModule({ shared }),
    StormGeneratedModule,
    StormModule
  );
  shared.ServiceRegistry.register(Storm);
  return { shared, Storm };
}
