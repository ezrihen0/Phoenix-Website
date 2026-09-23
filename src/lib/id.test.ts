import assert from "node:assert/strict";

import { createId, isUuid } from "./id";

assert.equal(isUuid(createId()), true);

const original = crypto.randomUUID;
Object.defineProperty(crypto, "randomUUID", { configurable: true, value: undefined });
try {
  const fallback = createId();
  assert.equal(isUuid(fallback), true);
  assert.notEqual(fallback, createId());
} finally {
  Object.defineProperty(crypto, "randomUUID", { configurable: true, value: original });
}

console.log("id fallback passed");
