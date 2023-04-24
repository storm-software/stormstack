/**
 * @generated SignedSource<<ac31f04548ad3ad9c4af009c1259557e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type LikeButtonClientQuery$variables = {
  ID: string;
};
export type LikeButtonClientQuery$data = {
  readonly REACTIONS: {
    readonly COUNT: number | null;
    readonly ID: string | null;
    readonly TYPE: string | null;
  } | null;
};
export type LikeButtonClientQuery = {
  response: LikeButtonClientQuery$data;
  variables: LikeButtonClientQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "ID"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "ID",
        "variableName": "ID"
      }
    ],
    "concreteType": "REACTIONS",
    "kind": "LinkedField",
    "name": "REACTIONS",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "ID",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "TYPE",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "COUNT",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "LikeButtonClientQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "LikeButtonClientQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "149abe138d1ba32e5787aacb8caea330",
    "id": null,
    "metadata": {},
    "name": "LikeButtonClientQuery",
    "operationKind": "query",
    "text": "query LikeButtonClientQuery(\n  $ID: String!\n) {\n  REACTIONS(ID: $ID) {\n    ID\n    TYPE\n    COUNT\n  }\n}\n"
  }
};
})();

(node as any).hash = "842b195d254380ff7c0d4460a7fba3de";

export default node;
