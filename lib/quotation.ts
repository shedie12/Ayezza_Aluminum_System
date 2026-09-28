import { z } from "zod";

// Sample PHP rates: awnings per piece; other products per square meter.
export const products = [
  { id: "sliding-window", name: "Sliding window", rate: 4500, detail: "More light. Effortless movement.", category: "Windows" },
  { id: "casement-window", name: "Casement window", rate: 5500, detail: "Open up to a better view.", category: "Windows" },
  { id: "sliding-door", name: "Sliding glass door", rate: 6500, detail: "Bring the outdoors closer.", category: "Doors" },
  { id: "glass-partition", name: "Glass partition", rate: 4000, detail: "Space to work. Room to think.", category: "Partitions" },
  { id: "cabinet", name: "Aluminum cabinet", rate: 4500, detail: "Storage made for your space.", category: "Cabinets" },
  { id: "awning", name: "Awning", rate: 3500, detail: "Shade and shelter, made to fit.", category: "Awnings" },
] as const;
export const finishes = [{ id: "natural", name: "Natural silver", multiplier: 1 }, { id: "black", name: "Matte black", multiplier: 1.15 }, { id: "white", name: "Powder white", multiplier: 1.1 }] as const;
export const itemSchema = z.object({ product: z.enum(["sliding-window", "casement-window", "sliding-door", "glass-partition", "cabinet", "awning"]), width: z.number().min(0.3).max(6), height: z.number().min(0.3).max(6), quantity: z.number().int().min(1).max(100), finish: z.enum(["natural", "black", "white"]) });
export type QuoteItem = z.infer<typeof itemSchema>;
export const leadSchema = z.object({ name: z.string().trim().min(2).max(100), email: z.email().max(200), phone: z.string().trim().regex(/^[+\d\s()\-]{7,25}$/), location: z.string().trim().min(3).max(200), notes: z.string().trim().max(2000), consent: z.literal(true), items: z.array(itemSchema).min(1).max(20), website: z.string().max(0) });
export type LeadInput = z.infer<typeof leadSchema>;
export const rateSchema = z.object({ rate: z.number().positive().max(1000000), unit: z.enum(["sqm", "sqft"]) });
export type ProductId = QuoteItem["product"];
export const pricingSchema = z.object({
  "sliding-window": rateSchema, "casement-window": rateSchema,
  "sliding-door": rateSchema, "glass-partition": rateSchema,
  cabinet: rateSchema, awning: rateSchema.extend({ unit: z.literal("piece") }),
});
export type Pricing = z.infer<typeof pricingSchema>;
export const defaultPricing = Object.fromEntries(products.map(p => [p.id, { rate: p.rate, unit: p.id === "awning" ? "piece" : "sqm" }])) as Pricing;
export const SQFT_PER_SQM = 1 / (0.3048 * 0.3048);
export function itemTotal(item: QuoteItem, pricing: Pricing = defaultPricing) { const price = pricing[item.product]; const finish = finishes.find(f => f.id === item.finish)!; const area = price.unit === "piece" ? 1 : item.width * item.height * (price.unit === "sqft" ? SQFT_PER_SQM : 1); return Math.round(area * item.quantity * price.rate * finish.multiplier * 100) / 100; }
export function quoteTotal(items: QuoteItem[], pricing: Pricing = defaultPricing) { return Math.round(items.reduce((sum, item) => sum + itemTotal(item, pricing), 0) * 100) / 100; }
export const money = (amount: number) => new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 2 }).format(amount);
