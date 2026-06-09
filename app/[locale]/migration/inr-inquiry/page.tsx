import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import PageLayout, { Section, ScopeTag } from "@/components/PageLayout";
import ExpandableApiTable, { type HighlightedSnippet } from "@/components/ExpandableApiTable";
import { inrMapping } from "@/data/api-mapping";
import { inrSnippetByOldApi } from "@/data/code-examples/inr-calls";
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

export default async function InrInquiryPage({
  params,
}: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("migration.inrInquiry");
  const tCommon = await getTranslations("common");

  const label = (ja: string, zh: string, en: string) =>
    locale === "ja" ? ja : locale === "zh" ? zh : en;

  const rows = await Promise.all(
    inrMapping.rows.map(async (row) => {
      const raw = inrSnippetByOldApi[row.oldApi];
      if (!raw) return row;
      return { ...row, snippet: await preHighlight(raw) };
    })
  );

  return (
    <PageLayout title={t("title")} subtitle={t("subtitle")} badge="Migration Guide">
      <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl text-sm text-blue-800 dark:text-blue-300">
        ℹ️ {label(
          "新 API では sellerOrderInquiries で未解決の照会を一括取得できます。旧 Post-Order API では個別 ID でしか取得できませんでした。",
          "新 API 中，sellerOrderInquiries 可批量获取未解决的查询。旧 Post-Order API 只能通过单个 ID 获取。",
          "The new API allows bulk retrieval of pending inquiries via sellerOrderInquiries. The old Post-Order API only supported lookup by individual inquiry ID."
        )}
      </div>

      <Section
        title={tCommon("requiredScopeTitle")}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-500 w-16">{tCommon("write")}</span>
            <ScopeTag scope="https://api.ebay.com/oauth/api_scope/sell.inquiry" />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-500 w-16">{tCommon("read")}</span>
            <ScopeTag scope="https://api.ebay.com/oauth/api_scope/sell.inquiry.read" />
          </div>
        </div>
      </Section>

      <Section
        title={tCommon("apiMappingTitle")}
        id="mapping"
      >
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
          {tCommon("expandHintPostOrder")}
        </p>
        <ExpandableApiTable rows={rows} />
      </Section>
    </PageLayout>
  );
}
