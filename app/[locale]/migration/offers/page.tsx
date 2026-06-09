import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import PageLayout, { Section, ScopeTag } from "@/components/PageLayout";
import ExpandableApiTable, { type HighlightedSnippet } from "@/components/ExpandableApiTable";
import { offersMapping } from "@/data/api-mapping";
import { offersSnippetByOldApi } from "@/data/code-examples/offers-calls";
import { highlight } from "@/lib/highlight";
import type { Lang } from "@/components/CodeTabs";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const LANGS: Lang[] = ["php", "ruby", "java", "nodejs", "go", "python"];

async function preHighlight(rawSnippet: { old: Record<Lang, string>; new: Record<Lang, string> }): Promise<HighlightedSnippet> {
  const entries = await Promise.all(
    LANGS.map(async (lang) => {
      const [oldHtml, newHtml] = await Promise.all([
        highlight(rawSnippet.old[lang] ?? "", lang),
        highlight(rawSnippet.new[lang] ?? "", lang),
      ]);
      return { lang, oldHtml, newHtml };
    })
  );
  return {
    old: Object.fromEntries(entries.map((e) => [e.lang, e.oldHtml])) as Record<Lang, string>,
    new: Object.fromEntries(entries.map((e) => [e.lang, e.newHtml])) as Record<Lang, string>,
    oldRaw: Object.fromEntries(LANGS.map((l) => [l, rawSnippet.old[l] ?? ""])) as Record<Lang, string>,
    newRaw: Object.fromEntries(LANGS.map((l) => [l, rawSnippet.new[l] ?? ""])) as Record<Lang, string>,
  };
}

export default async function OffersPage({
  params,
}: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("migration.offers");
  const tCommon = await getTranslations("common");

  const label = (ja: string, zh: string, en: string) =>
    locale === "ja" ? ja : locale === "zh" ? zh : en;

  const rows = await Promise.all(
    offersMapping.rows.map(async (row) => {
      const raw = offersSnippetByOldApi[row.oldApi];
      if (!raw) return row;
      return { ...row, snippet: await preHighlight(raw) };
    })
  );

  return (
    <PageLayout title={t("title")} subtitle={t("subtitle")} badge="Migration Guide">
      <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-800 dark:text-amber-300">
        ⚠️ {label(
          "旧 GetBestOffers は Trading API 経由で全出品のオファーを横断取得できましたが、新 API では出品単位（listingId）でのクエリが必要です。一括取得は sellerNegotiationHistory を使ってください。",
          "旧 GetBestOffers 可通过 Trading API 跨商品批量获取所有 offer，新 API 需按商品（listingId）分别查询。批量获取请使用 sellerNegotiationHistory。",
          "Old GetBestOffers could retrieve all offers across listings in one call. The new API queries per listing (listingId). Use sellerNegotiationHistory for bulk access."
        )}
      </div>

      <Section
        title={tCommon("requiredScopeTitle")}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-500 w-16">{tCommon("write")}</span>
            <ScopeTag scope="https://api.ebay.com/oauth/api_scope/sell.offer" />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-500 w-16">{tCommon("read")}</span>
            <ScopeTag scope="https://api.ebay.com/oauth/api_scope/sell.offer.read" />
          </div>
        </div>
      </Section>

      <Section
        title={tCommon("apiMappingTitle")}
        id="mapping"
      >
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
          {tCommon("expandHintGraphql")}
        </p>
        <ExpandableApiTable rows={rows} />
      </Section>
    </PageLayout>
  );
}
