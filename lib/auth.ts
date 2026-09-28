import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
const sign = (value: string) => createHmac("sha256", process.env.ADMIN_PASSWORD || "").update(value).digest("hex");
export function adminConfigured() { return (process.env.ADMIN_PASSWORD?.length || 0) >= 16; }
export function passwordMatches(value: string) { const expected = process.env.ADMIN_PASSWORD || ""; const a = Buffer.from(value); const b = Buffer.from(expected); return adminConfigured() && a.length === b.length && timingSafeEqual(a, b); }
export async function createSession() { const expires = String(Date.now() + 8 * 60 * 60 * 1000); (await cookies()).set("ayezza-admin", `${expires}.${sign(expires)}`, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 28800 }); }
export async function isAdmin() { if (!adminConfigured()) return false; const token = (await cookies()).get("ayezza-admin")?.value || ""; const [expires, signature] = token.split("."); if (!/^\d{13}$/.test(expires || "") || !/^[a-f0-9]{64}$/.test(signature || "") || Number(expires) < Date.now()) return false; return timingSafeEqual(Buffer.from(signature), Buffer.from(sign(expires))); }
