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
import {
  ForecastGeneratedModule,
  ForecastGeneratedSharedModule
} from "./__generated__/module";
import { ForecastCodeActionProvider } from "./forecast-code-action";
import { ForecastDefinitionProvider } from "./forecast-definition";
import { ForecastFormatter } from "./forecast-formatter";
import { ForecastLinker } from "./forecast-linker";
import { createForecastParser } from "./forecast-parser";
import {
  ForecastScopeComputation,
  ForecastScopeProvider
} from "./forecast-scope";
import ForecastWorkspaceManager from "./forecast-workspace-manager";
import {
  ForecastValidationRegistry,
  ForecastValidator
} from "./validators/forecast-validator";

/**
 * Declaration of custom services - add your own service classes here.
 */
export type ForecastAddedServices = {
  validation: {
    ForecastValidator: ForecastValidator;
  };
};

/**
 * Union of Langium default services and your custom services - use this as constructor parameter
 * of custom service classes.
 */
export type ForecastServices = LangiumServices & ForecastAddedServices;

/**
 * Dependency injection module that overrides Langium default services and contributes the
 * declared custom services. The Langium defaults can be partially specified to override only
 * selected services, while the custom services must be fully specified.
 */
export const ForecastModule: Module<
  ForecastServices,
  PartialLangiumServices & ForecastAddedServices
> = {
  references: {
    ScopeComputation: services => new ForecastScopeComputation(services),
    Linker: services => new ForecastLinker(services),
    ScopeProvider: services => new ForecastScopeProvider(services)
  },
  validation: {
    ValidationRegistry: services => new ForecastValidationRegistry(services),
    ForecastValidator: services => new ForecastValidator(services)
  },
  lsp: {
    Formatter: () => new ForecastFormatter(),
    CodeActionProvider: services => new ForecastCodeActionProvider(services),
    DefinitionProvider: services => new ForecastDefinitionProvider(services)
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
      WorkspaceManager: services => new ForecastWorkspaceManager(services),
      FileSystemProvider: services => context.fileSystemProvider(services),
      MutexLock: () => new MutexLock(),
      ConfigurationProvider: services =>
        new DefaultConfigurationProvider(services)
    }
  };
}

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
      LangiumParser: services => createForecastParser(services),
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
export function createForecastServices(context: DefaultSharedModuleContext): {
  shared: LangiumSharedServices;
  Forecast: ForecastServices;
} {
  const shared = inject(
    createSharedModule(context),
    ForecastGeneratedSharedModule
  );

  const Forecast = inject(
    createDefaultModule({ shared }),
    ForecastGeneratedModule,
    ForecastModule
  );
  shared.ServiceRegistry.register(Forecast);

  // registerValidationChecks(Forecast);
  return { shared, Forecast };
}
