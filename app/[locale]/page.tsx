import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import Link from "next/link";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const categoryIcons: Record<string, string> = {
  listing: "📦",
  order: "🛒",
  cancellation: "❌",
  returns: "↩️",
  inr: "📬",
  account: "👤",
  metadata: "🗂️",
  offers: "💬",
  messaging: "✉️",
  feedback: "⭐",
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tSite = await getTranslations("site");

  const categories = t.raw("categories") as Array<{
    id: string;
    title: string;
    description: string;
    newApi: string;
    href: string;
  }>;

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white dark:from-zinc-900 dark:to-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <span className="inline-block mb-4 px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              {t("hero.badge")}
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-white leading-tight whitespace-pre-line">
              {t("hero.title")}
            </h1>
            <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              {t("hero.description")}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={`/${locale}/getting-started`}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
              >
                {t("hero.cta")}
              </Link>
              <a
                href="#overview"
                className="px-6 py-3 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-600 rounded-lg font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors text-center"
              >
                {t("hero.ctaSecondary")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section id="overview" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{t("overview.title")}</h2>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">{t("overview.description")}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/${locale}${cat.href}`}
              className="group block rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-5 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{categoryIcons[cat.id] ?? "🔧"}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{cat.description}</p>
                  <span className="inline-block mt-2 text-xs font-mono px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                    {cat.newApi}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Pitfalls teaser */}
      <section className="border-t border-zinc-200 dark:border-zinc-800 bg-amber-50 dark:bg-amber-950/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="text-4xl">⚠️</div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{t("pitfallsTeaser.title")}</h2>
            <p className="mt-1 text-zinc-600 dark:text-zinc-400">{t("pitfallsTeaser.description")}</p>
          </div>
          <Link
            href={`/${locale}/pitfalls`}
            className="shrink-0 px-5 py-2.5 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition-colors text-sm"
          >
            {t("pitfallsTeaser.cta")}
          </Link>
        </div>
      </section>
    </div>
  );
}
