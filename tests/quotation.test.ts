import { test } from "node:test";
import assert from "node:assert/strict";
import { itemSchema, leadSchema, itemTotal, quoteTotal, type QuoteItem } from "../lib/quotation";
const item: QuoteItem = { product: "sliding-window", width: 1.2, height: 1.2, quantity: 1, finish: "black" };
test("area, finish premium and quantity determine the estimate", () => { assert.equal(itemTotal(item), 7452); assert.equal(itemTotal({ ...item, quantity: 2 }), 14904); assert.equal(quoteTotal([item, { ...item, finish: "natural" }]), 13932); });
test("invalid dimensions, products, and quantities are rejected", () => { for (const patch of [{ width: -1 }, { height: 0 }, { quantity: 0.5 }, { quantity: 101 }, { product: "unknown" }, { width: Infinity }]) assert.equal(itemSchema.safeParse({ ...item, ...patch }).success, false); });
test("contact information, consent, and valid items are required", () => { const lead = { name: "Test Customer", email: "test@example.com", phone: "09123456789", location: "Manila", notes: "", consent: true, website: "", items: [item] }; assert.equal(leadSchema.safeParse(lead).success, true); for (const patch of [{ consent: false }, { email: "invalid" }, { items: [] }, { website: "spam" }, { phone: "invalid" }]) assert.equal(leadSchema.safeParse({ ...lead, ...patch }).success, false); });
