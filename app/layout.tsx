import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "eBay API Migration Guide",
  description: "Trading API to GraphQL API migration guide for eBay sellers and vendors",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
