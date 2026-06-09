"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

const locales = ["ja", "en", "zh"] as const;

function LocaleSwitcher() {
  const t = useTranslations("lang");
  const locale = useLocale();
  const pathname = usePathname();

  function switchLocale(next: string) {
    const segments = pathname.split("/");
    segments[1] = next;
    return segments.join("/");
  }

  return (
    <div className="flex items-center gap-1">
      {locales.map((l) => (
        <Link
          key={l}
          href={switchLocale(l)}
          className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
            locale === l
              ? "bg-blue-600 text-white"
              : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          }`}
        >
          {t(l)}
        </Link>
      ))}
    </div>
  );
}

export default function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/getting-started`, label: t("gettingStarted") },
    { href: `/${locale}/pitfalls`, label: t("pitfalls") },
    { href: `/${locale}/not-migrated`, label: t("notMigrated") },
  ];

  const migrationItems = [
    { href: `/${locale}/migration/listing`, label: t("listing") },
    { href: `/${locale}/migration/order`, label: t("order") },
    { href: `/${locale}/migration/cancellation`, label: t("cancellation") },
    { href: `/${locale}/migration/returns`, label: t("returns") },
    { href: `/${locale}/migration/inr-inquiry`, label: t("inrInquiry") },
    { href: `/${locale}/migration/account`, label: t("account") },
    { href: `/${locale}/migration/metadata`, label: t("metadata") },
    { href: `/${locale}/migration/offers`, label: t("offers") },
    { href: `/${locale}/migration/messaging`, label: t("messaging") },
    { href: `/${locale}/migration/feedback`, label: t("feedback") },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href={`/${locale}`} className="font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600">eBay</span>
            <span className="hidden sm:inline text-zinc-700 dark:text-zinc-300 font-medium text-base">API Migration</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-1.5 rounded-md text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            {/* Migration dropdown */}
            <div className="relative group">
              <button className="px-3 py-1.5 rounded-md text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800 transition-colors flex items-center gap-1">
                {t("migration")}
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute right-0 top-full mt-1 w-52 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="py-1">
                  {migrationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LocaleSwitcher />
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 pb-4">
          <div className="pt-2 space-y-1">
            {[...navItems.slice(1), ...migrationItems].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 rounded-md text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
