import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { type LeadInput, quoteTotal } from "./quotation";
import { getPricing } from "./pricing";
export const statuses = ["New", "Contacted", "Quoted", "Won", "Lost"] as const;
export type Lead = Omit<LeadInput, "website"> & { id: string; createdAt: string; total: number; status: typeof statuses[number] };
const directory = () => process.env.LEADS_DATA_DIR || path.join(process.cwd(), "data", "leads");
export async function saveLead(input: LeadInput) {
  const { website: _website, ...details } = input;
  const lead: Lead = { ...details, id: randomUUID(), createdAt: new Date().toISOString(), total: quoteTotal(input.items, await getPricing()), status: "New" };
  await mkdir(directory(), { recursive: true });
  await writeFile(path.join(directory(), `${lead.id}.json`), JSON.stringify(lead), { flag: "wx", mode: 0o600 });
  return lead;
}
export async function getLeads(): Promise<Lead[]> {
  await mkdir(directory(), { recursive: true });
  const files = (await readdir(directory())).filter(f => /^[\da-f-]{36}\.json$/.test(f));
  return (await Promise.all(files.map(async file => JSON.parse(await readFile(path.join(directory(), file), "utf8")) as Lead))).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
export async function updateLeadStatus(id: string, status: Lead["status"]) {
  if (!/^[\da-f-]{36}$/.test(id) || !statuses.includes(status)) throw new Error("Invalid update");
  // Store status independently so simultaneous updates cannot corrupt customer data.
  await mkdir(path.join(directory(), "statuses"), { recursive: true });
  await writeFile(path.join(directory(), "statuses", id), status);
}
export async function getLeadStatus(lead: Lead): Promise<Lead["status"]> {
  try { const status = await readFile(path.join(directory(), "statuses", lead.id), "utf8"); return statuses.includes(status as Lead["status"]) ? status as Lead["status"] : lead.status; } catch { return lead.status; }
}
