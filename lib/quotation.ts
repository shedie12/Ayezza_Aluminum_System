import { z } from "zod";

// Sample PHP per-square-metre rates. Replace with approved business pricing.
export const products = [
  { id: "sliding-window", name: "Sliding window", rate: 4500, detail: "More light. Effortless movement.", category: "Windows" },
  { id: "casement-window", name: "Casement window", rate: 5500, detail: "Open up to a better view.", category: "Windows" },
  { id: "sliding-door", name: "Sliding glass door", rate: 6500, detail: "Bring the outdoors closer.", category: "Doors" },
  { id: "glass-partition", name: "Glass partition", rate: 4000, detail: "Space to work. Room to think.", category: "Partitions" },
] as const;
export const finishes = [{ id: "natural", name: "Natural silver", multiplier: 1 }, { id: "black", name: "Matte black", multiplier: 1.15 }, { id: "white", name: "Powder white", multiplier: 1.1 }] as const;
export const itemSchema = z.object({ product: z.enum(["sliding-window", "casement-window", "sliding-door", "glass-partition"]), width: z.number().min(0.3).max(6), height: z.number().min(0.3).max(6), quantity: z.number().int().min(1).max(100), finish: z.enum(["natural", "black", "white"]) });
export type QuoteItem = z.infer<typeof itemSchema>;
export const leadSchema = z.object({ name: z.string().trim().min(2).max(100), email: z.email().max(200), phone: z.string().trim().regex(/^[+\d\s()\-]{7,25}$/), location: z.string().trim().min(3).max(200), notes: z.string().trim().max(2000), consent: z.literal(true), items: z.array(itemSchema).min(1).max(20), website: z.string().max(0) });
export type LeadInput = z.infer<typeof leadSchema>;
export function itemTotal(item: QuoteItem) { const product = products.find(p => p.id === item.product)!; const finish = finishes.find(f => f.id === item.finish)!; return Math.round(item.width * item.height * item.quantity * product.rate * finish.multiplier * 100) / 100; }
export function quoteTotal(items: QuoteItem[]) { return Math.round(items.reduce((sum, item) => sum + itemTotal(item), 0) * 100) / 100; }
export const money = (amount: number) => new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 2 }).format(amount);
