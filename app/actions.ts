"use server";
import { leadSchema, pricingSchema, products } from "@/lib/quotation";
import { savePricing } from "@/lib/pricing";
import { saveLead, updateLeadStatus, statuses } from "@/lib/leads";
import { createSession, isAdmin, passwordMatches } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function submitLead(input: unknown) {
  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) return { error: "Please check your contact details and quotation measurements." };
  try { const lead = await saveLead(parsed.data); return { id: lead.id, total: lead.total }; }
  catch { return { error: "We couldn’t save your request. Please try again shortly." }; }
}
export async function login(form: FormData) { if (!passwordMatches(String(form.get("password") || ""))) redirect("/admin?error=1"); await createSession(); redirect("/admin"); }
export async function logout() { (await cookies()).delete("ayezza-admin"); redirect("/admin"); }
export async function changeStatus(form: FormData) { if (!(await isAdmin())) throw new Error("Unauthorized"); const status = String(form.get("status")); if (!statuses.includes(status as typeof statuses[number])) throw new Error("Invalid status"); await updateLeadStatus(String(form.get("id")), status as typeof statuses[number]); revalidatePath("/admin"); }

export async function updatePricing(_previous: { error?: string; success?: string }, form: FormData) {
  if (!(await isAdmin())) return { error: "Your session expired. Sign in again before saving." };
  const parsed = pricingSchema.safeParse(Object.fromEntries(products.map(p => [p.id, {
    rate: Number(form.get(`${p.id}.rate`)), unit: form.get(`${p.id}.unit`),
  }])));
  if (!parsed.success) return { error: "Enter a rate greater than zero and no more than 1,000,000, and select a billing unit for every product." };
  try { await savePricing(parsed.data); }
  catch { return { error: "Could not save pricing. Please try again." }; }
  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { success: "Pricing saved. New quotation requests will use these rates." };
}
