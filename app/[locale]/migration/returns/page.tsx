import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import PageLayout, { Section, ScopeTag } from "@/components/PageLayout";
import ExpandableApiTable, { type HighlightedSnippet } from "@/components/ExpandableApiTable";
import ApiMappingTable from "@/components/ApiMappingTable";
import { returnsMapping } from "@/data/api-mapping";
import { returnsSnippetByOldApi } from "@/data/code-examples/returns-calls";
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

export default async function ReturnsPage({
  params,
}: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("migration.returns");
  const tCommon = await getTranslations("common");

  const label = (ja: string, zh: string, en: string) =>
    locale === "ja" ? ja : locale === "zh" ? zh : en;

  const rows = await Promise.all(
    returnsMapping.rows.map(async (row) => {
      const raw = returnsSnippetByOldApi[row.oldApi];
      if (!raw) return row;
      return { ...row, snippet: await preHighlight(raw) };
    })
  );

  const notMappedRows = returnsMapping.rows.filter((r) => !returnsSnippetByOldApi[r.oldApi]);

  return (
    <PageLayout title={t("title")} subtitle={t("subtitle")} badge="Migration Guide">
      <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-800 dark:text-amber-300">
        ⚠️ {label(
          "旧 Post-Order API の「Case（ケース）」エンティティは廃止されました。INR ケースは Order Inquiry API、返品ケースは Return API に統合されています。",
          "旧 Post-Order API 的「Case（案例）」实体已废除。INR 案例合并到 Order Inquiry API，退货案例合并到 Return API。",
          "The old Post-Order API 'Case' entity has been removed. INR cases are now handled in Order Inquiry API; return cases are within Return API."
        )}
      </div>

      <Section
        title={tCommon("requiredScopeTitle")}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-500 w-16">{tCommon("write")}</span>
            <ScopeTag scope="https://api.ebay.com/oauth/api_scope/sell.return" />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-500 w-16">{tCommon("read")}</span>
            <ScopeTag scope="https://api.ebay.com/oauth/api_scope/sell.return.read" />
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

      {notMappedRows.length > 0 && (
        <Section
          title={label("その他の操作", "其他操作", "Other Operations")}
          id="other"
        >
          <ApiMappingTable rows={notMappedRows} />
        </Section>
      )}
    </PageLayout>
  );
}
