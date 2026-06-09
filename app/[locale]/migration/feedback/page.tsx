import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import PageLayout, { Section, ScopeTag } from "@/components/PageLayout";
import ExpandableApiTable, { type HighlightedSnippet } from "@/components/ExpandableApiTable";
import { feedbackMapping } from "@/data/api-mapping";
import { feedbackSnippetByOldApi } from "@/data/code-examples/feedback-calls";
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

export default async function FeedbackPage({
  params,
}: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("migration.feedback");
  const tCommon = await getTranslations("common");

  const label = (ja: string, zh: string, en: string) =>
    locale === "ja" ? ja : locale === "zh" ? zh : en;

  const rows = await Promise.all(
    feedbackMapping.rows.map(async (row) => {
      const raw = feedbackSnippetByOldApi[row.oldApi];
      if (!raw) return row;
      return { ...row, snippet: await preHighlight(raw) };
    })
  );

  return (
    <PageLayout title={t("title")} subtitle={t("subtitle")} badge="Migration Guide">
      <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl text-sm text-blue-800 dark:text-blue-300">
        ℹ️ {label(
          "新 Commerce Feedback API では leaveFeedback 前に getItemsAwaitingFeedback で ratingKey を取得し、ratings 配列で評価を送信するフローが推奨です。",
          "新 Commerce Feedback API 推荐在调用 leaveFeedback 前，先通过 getItemsAwaitingFeedback 获取 ratingKey，再通过 ratings 数组提交评价。",
          "With the new Commerce Feedback API, the recommended flow is to call getItemsAwaitingFeedback first to retrieve ratingKey values, then submit ratings via the leaveFeedback ratings array."
        )}
      </div>

      <Section
        title={tCommon("requiredScopeTitle")}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-500 w-16">{tCommon("write")}</span>
            <ScopeTag scope="https://api.ebay.com/oauth/api_scope/commerce.feedback" />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-500 w-16">{tCommon("read")}</span>
            <ScopeTag scope="https://api.ebay.com/oauth/api_scope/commerce.feedback.readonly" />
          </div>
        </div>
      </Section>

      <Section
        title={tCommon("apiMappingTitle")}
        id="mapping"
      >
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
          {label(
            "▶ のある行をクリックすると旧コード（Trading API SOAP/XML）と新コード（Commerce Feedback REST API）を並べて確認できます。",
            "点击带 ▶ 的行可并排查看旧代码（Trading API SOAP/XML）和新代码（Commerce Feedback REST API）。",
            "Click rows with ▶ to compare old (Trading API SOAP/XML) and new (Commerce Feedback REST API) code side by side."
          )}
        </p>
        <ExpandableApiTable rows={rows} />
      </Section>
    </PageLayout>
  );
}
