import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Ayezza Aluminum | Beautiful spaces, built to last", description: "Explore custom aluminum windows, doors and glass partitions. Build a sample estimate and request a personalized quotation from Ayezza Aluminum." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" data-scroll-behavior="smooth"><body>{children}</body></html>; }
