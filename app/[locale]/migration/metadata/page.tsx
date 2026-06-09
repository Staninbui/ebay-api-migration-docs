import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import PageLayout, { Section } from "@/components/PageLayout";
import ExpandableApiTable, { type HighlightedSnippet } from "@/components/ExpandableApiTable";
import { metadataMapping } from "@/data/api-mapping";
import { metadataSnippetByOldApi } from "@/data/code-examples/metadata-calls";
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

export default async function MetadataPage({
  params,
}: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("migration.metadata");
  const tCommon = await getTranslations("common");

  const label = (ja: string, zh: string, en: string) =>
    locale === "ja" ? ja : locale === "zh" ? zh : en;

  const rows = await Promise.all(
    metadataMapping.rows.map(async (row) => {
      const raw = metadataSnippetByOldApi[row.oldApi];
      if (!raw) return row;
      return { ...row, snippet: await preHighlight(raw) };
    })
  );

  return (
    <PageLayout title={t("title")} subtitle={t("subtitle")} badge="Migration Guide">
      <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl text-sm text-blue-800 dark:text-blue-300">
        ℹ️ {label(
          "Taxonomy API では、まず getDefaultCategoryTreeId（marketplace_id 必須）で category_tree_id を取得してから getCategoryTree を呼び出す 2 ステップが必要です。レスポンスが大きいため gzip 圧縮の使用を推奨します。",
          "Taxonomy API 需要两步：先用 getDefaultCategoryTreeId（marketplace_id 必填）获取 category_tree_id，再调用 getCategoryTree。建议使用 gzip 压缩，因为响应体较大。",
          "The Taxonomy API requires two steps: first call getDefaultCategoryTreeId (marketplace_id required) to get the category_tree_id, then call getCategoryTree. Use gzip compression — the response can be very large."
        )}
      </div>

      <Section
        title={tCommon("apiMappingTitle")}
        id="mapping"
      >
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
          {label(
            "▶ のある行をクリックすると旧コード（Trading API SOAP/XML）と新コード（Taxonomy/Metadata/Catalog REST API）を並べて確認できます。",
            "点击带 ▶ 的行可并排查看旧代码（Trading API SOAP/XML）和新代码（Taxonomy/Metadata/Catalog REST API）。",
            "Click rows with ▶ to compare old (Trading API SOAP/XML) and new (Taxonomy/Metadata/Catalog REST API) code side by side."
          )}
        </p>
        <ExpandableApiTable rows={rows} />
      </Section>
    </PageLayout>
  );
}
