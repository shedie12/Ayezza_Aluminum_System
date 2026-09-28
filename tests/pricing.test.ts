import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { defaultPricing, itemTotal, pricingSchema, itemSchema, type QuoteItem } from "../lib/quotation";
import { getPricing, savePricing } from "../lib/pricing";
import { saveLead } from "../lib/leads";

const item: QuoteItem = { product: "cabinet", width: 1, height: 1, quantity: 1, finish: "natural" };
test("awnings charge per piece, independent of area, with quantity and finish premiums", () => {
  const pricing = structuredClone(defaultPricing);
  pricing.awning = { rate: 1000, unit: "piece" };
  const awning: QuoteItem = { ...item, product: "awning", width: 2, height: 3 };
  assert.equal(itemTotal(awning, pricing), 1000);
  assert.equal(itemTotal({ ...awning, width: 4, height: 5 }, pricing), 1000);
  assert.equal(itemTotal({ ...awning, quantity: 3 }, pricing), 3000);
  assert.equal(itemTotal({ ...awning, quantity: 2, finish: "black" }, pricing), 2300);
  assert.equal(pricingSchema.safeParse({ ...pricing, awning: { rate: 1000, unit: "sqm" } }).success, false);
  assert.equal(pricingSchema.safeParse({ ...pricing, cabinet: { rate: 1000, unit: "piece" } }).success, false);
});
test("square-foot rates convert meter dimensions before rounding", () => {
  const pricing = structuredClone(defaultPricing);
  pricing.cabinet = { rate: 100, unit: "sqft" };
  assert.equal(itemTotal(item, pricing), 1076.39);
  assert.equal(itemTotal({ ...item, quantity: 2, finish: "black" }, pricing), 2475.7);
  pricing.cabinet = { rate: 100, unit: "sqm" };
  assert.equal(itemTotal(item, pricing), 100);
});
test("pricing rejects invalid rates, missing products and unknown units", () => {
  for (const rate of [0, -1, NaN, Infinity, 1000001]) {
    assert.equal(pricingSchema.safeParse({ ...defaultPricing, cabinet: { rate, unit: "sqm" } }).success, false);
  }
  assert.equal(pricingSchema.safeParse({}).success, false);
  assert.equal(pricingSchema.safeParse({ ...defaultPricing, cabinet: { rate: 100, unit: "feet" } }).success, false);
  for (const product of ["cabinet", "awning"]) assert.equal(itemSchema.safeParse({ ...item, product }).success, true);
});
test("pricing persists and new leads use server rates without changing old totals", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "ayezza-pricing-"));
  const oldFile = process.env.PRICING_DATA_FILE;
  const oldDirectory = process.env.LEADS_DATA_DIR;
  process.env.PRICING_DATA_FILE = path.join(directory, "pricing.json");
  process.env.LEADS_DATA_DIR = directory;
  try {
    assert.deepEqual(await getPricing(), defaultPricing);
    const pricing = structuredClone(defaultPricing);
    pricing.cabinet = { rate: 100, unit: "sqft" };
    await savePricing(pricing);
    assert.deepEqual(await getPricing(), pricing);
    const input = { name: "Test Customer", email: "test@example.com", phone: "09123456789", location: "Manila", notes: "", consent: true as const, website: "", items: [item] };
    const first = await saveLead(input);
    assert.equal(first.total, 1076.39);
    const awningInput = { ...input, items: [{ ...item, product: "awning" as const, width: 2, height: 3, quantity: 2 }] };
    pricing.awning = { rate: 1000, unit: "piece" };
    await savePricing(pricing);
    assert.equal((await saveLead(awningInput)).total, 2000);
    for (const unit of ["sqm", "sqft"]) {
      await writeFile(process.env.PRICING_DATA_FILE!, JSON.stringify({ ...pricing, awning: { rate: 1250, unit } }));
      const migrated = await getPricing();
      assert.deepEqual(migrated.awning, { rate: 1250, unit: "piece" });
      assert.equal((await saveLead(awningInput)).total, 2500);
    }
    pricing.cabinet = { rate: 200, unit: "sqm" };
    await savePricing(pricing);
    assert.equal((await saveLead(input)).total, 200);
    assert.equal(first.total, 1076.39);
  } finally {
    if (oldFile === undefined) delete process.env.PRICING_DATA_FILE; else process.env.PRICING_DATA_FILE = oldFile;
    if (oldDirectory === undefined) delete process.env.LEADS_DATA_DIR; else process.env.LEADS_DATA_DIR = oldDirectory;
    await rm(directory, { recursive: true, force: true });
  }
});
