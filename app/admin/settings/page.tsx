import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getPricing } from "@/lib/pricing";
import PricingSettings from "@/components/pricing-settings";

export const dynamic = "force-dynamic";
export const metadata = { title: "Pricing settings | Ayezza", robots: { index: false, follow: false } };

export default async function Settings() {
  if (!(await isAdmin())) redirect("/admin");
  const pricing = await getPricing();
  return <main className="admin-shell">
    <div className="admin-header"><div><Link href="/admin" className="eyebrow">← BACK TO PROJECT LEADS</Link><h1>Pricing settings</h1></div></div>
    <PricingSettings pricing={pricing}/>
  </main>;
}
