import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import PageLayout, { Section, ScopeTag } from "@/components/PageLayout";
import ExpandableApiTable, { type HighlightedSnippet } from "@/components/ExpandableApiTable";
import ApiMappingTable from "@/components/ApiMappingTable";
import { messagingMapping } from "@/data/api-mapping";
import { messagingSnippetByOldApi } from "@/data/code-examples/messaging-calls";
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

export default async function MessagingPage({
  params,
}: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("migration.messaging");
  const tCommon = await getTranslations("common");

  const label = (ja: string, zh: string, en: string) =>
    locale === "ja" ? ja : locale === "zh" ? zh : en;

  const rows = await Promise.all(
    messagingMapping.rows.map(async (row) => {
      const raw = messagingSnippetByOldApi[row.oldApi];
      if (!raw) return row;
      return { ...row, snippet: await preHighlight(raw) };
    })
  );

  const notMigratedRows = messagingMapping.rows.filter((r) => r.type === "not-migrated");

  return (
    <PageLayout title={t("title")} subtitle={t("subtitle")} badge="Migration Guide">
      <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-800 dark:text-amber-300">
        ⚠️ {label(
          "旧 Trading API ではメッセージの「フォルダ」概念がありましたが、新 Commerce Message API では「会話（Conversation）」単位に統一されました。conversation_type は必須パラメータです（FROM_MEMBERS / FROM_EBAY）。",
          "旧 Trading API 有消息「文件夹」概念，新 Commerce Message API 统一为「会话（Conversation）」。conversation_type 是必填参数（FROM_MEMBERS / FROM_EBAY）。",
          "The old Trading API had a 'folder' concept for messages. The new Commerce Message API unifies everything into 'conversations'. conversation_type is a required parameter (FROM_MEMBERS / FROM_EBAY)."
        )}
      </div>

      <Section
        title={tCommon("requiredScopeTitle")}
      >
        <ScopeTag scope="https://api.ebay.com/oauth/api_scope/commerce.message" />
      </Section>

      <Section
        title={tCommon("apiMappingTitle")}
        id="mapping"
      >
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
          {label(
            "▶ のある行をクリックすると旧コード（Trading API SOAP/XML）と新コード（Commerce Message REST API）を並べて確認できます。",
            "点击带 ▶ 的行可并排查看旧代码（Trading API SOAP/XML）和新代码（Commerce Message REST API）。",
            "Click rows with ▶ to compare old (Trading API SOAP/XML) and new (Commerce Message REST API) code side by side."
          )}
        </p>
        <ExpandableApiTable rows={rows} />
      </Section>

      {notMigratedRows.length > 0 && (
        <Section
          title={tCommon("notMigratedSection")}
          id="not-migrated"
        >
          <ApiMappingTable rows={notMigratedRows} />
        </Section>
      )}
    </PageLayout>
  );
}
