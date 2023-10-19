// We use WebCrypto aka globalThis.crypto, which exists in browsers and node.js 16+.
// See utils.ts for details.
// The file will throw on node.js 14 and earlier.
import * as nodeCrypto from "node:crypto";

export const crypto: nodeCrypto.webcrypto.Crypto | undefined =
  nodeCrypto && typeof nodeCrypto === "object" && "webcrypto" in nodeCrypto
    ? (nodeCrypto.webcrypto as any)
    : globalThis.crypto
    ? globalThis.crypto
    : undefined;
