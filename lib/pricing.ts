import { mkdir, readFile, rename, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { defaultPricing, pricingSchema, type Pricing } from "./quotation";

const filePath = () => process.env.PRICING_DATA_FILE || path.join(process.env.LEADS_DATA_DIR || path.join(process.cwd(), "data", "leads"), "pricing.json");

export async function getPricing(): Promise<Pricing> {
  try {
    const stored = JSON.parse(await readFile(filePath(), "utf8"));
    // Preserve the configured numeric rate when reading older area-based awning settings.
    // The administrator should review that rate as a per-piece price.
    if (stored?.awning && ["sqm", "sqft"].includes(stored.awning.unit)) {
      stored.awning.unit = "piece";
    }
    return pricingSchema.parse(stored);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return structuredClone(defaultPricing);
    throw error;
  }
}

export async function savePricing(input: Pricing) {
  const pricing = pricingSchema.parse(input);
  const file = filePath();
  await mkdir(path.dirname(file), { recursive: true });
  const temporary = `${file}.${randomUUID()}.tmp`;
  try {
    await writeFile(temporary, JSON.stringify(pricing, null, 2), { flag: "wx", mode: 0o600 });
    await rename(temporary, file);
  } finally {
    await rm(temporary, { force: true });
  }
}
