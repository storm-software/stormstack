import {
  buildASTSchema,
  ConstDirectiveNode,
  DefinitionNode,
  DocumentNode,
  EnumValueDefinitionNode,
  FieldDefinitionNode,
  GraphQLSchema,
  InputValueDefinitionNode,
  Kind,
  lexicographicSortSchema,
  NamedTypeNode,
  OperationTypeDefinitionNode,
  visit,
} from "graphql";
import { sort } from "radash";

/**
 * Builds GraphQLSchema without validation of SDL
 */
export function buildSchema(
  schema: any,
  transformError = (error: unknown) => error
): GraphQLSchema {
  try {
    return lexicographicSortSchema(
      buildASTSchema(schema.document, {
        assumeValid: true,
        assumeValidSDL: true,
      })
    );
  } catch (error) {
    throw transformError(error);
  }
}

export function minifySchema(schema: string): string {
  return schema.replace(/\s+/g, " ").trim();
}

export function createConnection<TInput>(): {
  nodes(nodes: readonly TInput[]): readonly TInput[];
  total(nodes: readonly TInput[]): number;
};
export function createConnection<TInput, TOutput = TInput>(
  map: (node: TInput) => TOutput
): {
  nodes(nodes: readonly TInput[]): readonly TOutput[];
  total(nodes: readonly TInput[]): number;
};
export function createConnection(map?: (node: unknown) => unknown): {
  nodes(nodes: readonly unknown[]): readonly unknown[];
  total(nodes: readonly unknown[]): number;
} {
  return {
    nodes(nodes: readonly unknown[]): readonly unknown[] {
      if (map) {
        return nodes.map(map);
      }
      return nodes ?? [];
    },
    total(nodes: readonly unknown[]) {
      return nodes?.length ?? 0;
    },
  };
}

export function createDummyConnection<TInput>(): {
  edges(nodes: readonly TInput[]): readonly {
    node: TInput;
    cursor: string;
  }[];
  pageInfo(nodes: readonly TInput[]): {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string;
    endCursor: string;
  };
};
export function createDummyConnection<TInput, TOutput = TInput>(
  map: (node: TInput) => TOutput
): {
  edges(nodes: readonly TInput[]): readonly {
    node: TOutput;
    cursor: string;
  }[];
  pageInfo(nodes: readonly TInput[]): {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string;
    endCursor: string;
  };
};
/**
 * Creates a dummy connection for an array value.
 */
export function createDummyConnection(map?: (node: unknown) => unknown): {
  edges(nodes: readonly unknown[]): readonly {
    node: unknown;
    cursor: string;
  }[];
  pageInfo(nodes: readonly unknown[]): {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string;
    endCursor: string;
  };
} {
  return {
    edges(nodes: readonly unknown[]): readonly {
      node: unknown;
      cursor: string;
    }[] {
      return nodes.map((node, index) => {
        return {
          node: map ? map(node) : node,
          cursor: String(index),
        };
      });
    },
    pageInfo() {
      return {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: "",
        endCursor: "",
      };
    },
  };
}

export function sortDocumentNode(doc: DocumentNode): DocumentNode {
  return visit(doc, {
    Document(node) {
      return {
        ...node,
        definitions: sortNodes(node.definitions),
      };
    },
    SchemaDefinition(node) {
      return {
        ...node,
        directives: sortNodes(node.directives),
        operationTypes: sortNodes(node.operationTypes),
      };
    },
    SchemaExtension(node) {
      return {
        ...node,
        directives: sortNodes(node.directives),
        operationTypes: sortNodes(node.operationTypes),
      };
    },
    ScalarTypeDefinition(node) {
      return {
        ...node,
        directives: sortNodes(node.directives),
      };
    },
    ScalarTypeExtension(node) {
      return {
        ...node,
        directives: sortNodes(node.directives),
      };
    },
    ObjectTypeDefinition(node) {
      return {
        ...node,
        directives: sortNodes(node.directives),
        fields: sortNodes(node.fields),
        interfaces: sortNodes(node.interfaces),
      };
    },
    ObjectTypeExtension(node) {
      return {
        ...node,
        directives: sortNodes(node.directives),
        fields: sortNodes(node.fields),
        interfaces: sortNodes(node.interfaces),
      };
    },
    InterfaceTypeDefinition(node) {
      return {
        ...node,
        directives: sortNodes(node.directives),
        fields: sortNodes(node.fields),
        interfaces: sortNodes(node.interfaces),
      };
    },
    InterfaceTypeExtension(node) {
      return {
        ...node,
        directives: sortNodes(node.directives),
        fields: sortNodes(node.fields),
        interfaces: sortNodes(node.interfaces),
      };
    },
    UnionTypeDefinition(node) {
      return {
        ...node,
        directives: sortNodes(node.directives),
        types: sortNodes(node.types),
      };
    },
    UnionTypeExtension(node) {
      return {
        ...node,
        directives: sortNodes(node.directives),
        types: sortNodes(node.types),
      };
    },
    EnumTypeDefinition(node) {
      return {
        ...node,
        directives: sortNodes(node.directives),
        values: sortNodes(node.values),
      };
    },
    EnumTypeExtension(node) {
      return {
        ...node,
        directives: sortNodes(node.directives),
        values: sortNodes(node.values),
      };
    },
    InputObjectTypeDefinition(node) {
      return {
        ...node,
        directives: sortNodes(node.directives),
        fields: sortNodes(node.fields),
      };
    },
    InputObjectTypeExtension(node) {
      return {
        ...node,
        directives: sortNodes(node.directives),
        fields: sortNodes(node.fields),
      };
    },
    DirectiveDefinition(node) {
      return {
        ...node,
        arguments: sortNodes(node.arguments),
      };
    },
    FieldDefinition(node) {
      return {
        ...node,
        arguments: sortNodes(node.arguments),
        directives: sortNodes(node.directives),
      };
    },
    InputValueDefinition(node) {
      return {
        ...node,
        directives: sortNodes(node.directives),
      };
    },
    EnumValueDefinition(node) {
      return {
        ...node,
        directives: sortNodes(node.directives),
      };
    },
  });
}

function sortNodes(nodes: readonly DefinitionNode[]): readonly DefinitionNode[];
function sortNodes(
  nodes: readonly ConstDirectiveNode[] | undefined
): readonly ConstDirectiveNode[] | undefined;
function sortNodes(
  nodes: readonly OperationTypeDefinitionNode[] | undefined
): readonly OperationTypeDefinitionNode[] | undefined;
function sortNodes(
  nodes: readonly FieldDefinitionNode[] | undefined
): readonly FieldDefinitionNode[] | undefined;
function sortNodes(
  nodes: readonly NamedTypeNode[] | undefined
): readonly NamedTypeNode[] | undefined;
function sortNodes(
  nodes: readonly EnumValueDefinitionNode[] | undefined
): readonly EnumValueDefinitionNode[] | undefined;
function sortNodes(
  nodes: readonly InputValueDefinitionNode[] | undefined
): readonly InputValueDefinitionNode[] | undefined;
function sortNodes(
  nodes: readonly any[] | undefined
): readonly any[] | undefined {
  if (nodes) {
    if (nodes.length === 0) {
      return [];
    }

    if (
      isOfKindList<OperationTypeDefinitionNode>(
        nodes,
        Kind.OPERATION_TYPE_DEFINITION
      )
    ) {
      return sort(nodes, "operation");
    }

    return sort(nodes, "kind", "name.value");
  }

  return;
}

function isOfKindList<T>(
  nodes: readonly any[],
  kind: string | string[]
): nodes is T[] {
  return typeof kind === "string"
    ? nodes[0].kind === kind
    : kind.includes(nodes[0].kind);
}
