import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import PageLayout, { Section, ScopeTag } from "@/components/PageLayout";
import ExpandableApiTable, { type HighlightedSnippet } from "@/components/ExpandableApiTable";
import ApiMappingTable from "@/components/ApiMappingTable";
import { accountMapping } from "@/data/api-mapping";
import { accountSnippetByOldApi } from "@/data/code-examples/account-calls";
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

export default async function AccountPage({
  params,
}: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("migration.account");
  const tCommon = await getTranslations("common");

  const label = (ja: string, zh: string, en: string) =>
    locale === "ja" ? ja : locale === "zh" ? zh : en;

  const rows = await Promise.all(
    accountMapping.rows.map(async (row) => {
      const raw = accountSnippetByOldApi[row.oldApi];
      if (!raw) return row;
      return { ...row, snippet: await preHighlight(raw) };
    })
  );

  const notMigratedRows = accountMapping.rows.filter((r) => r.type === "not-migrated");

  return (
    <PageLayout title={t("title")} subtitle={t("subtitle")} badge="Migration Guide">
      <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-800 dark:text-red-300">
        🔒 {label(
          "GetUserContactDetails は PII（個人情報）保護のため永続的に削除されました。他のユーザーの連絡先情報を取得する API は新しいプラットフォームには存在しません。また新 Identity API は認証ユーザー自身の情報のみ返します。",
          "GetUserContactDetails 因 PII（个人信息）保护已永久删除。新平台上不存在获取其他用户联系信息的 API。新 Identity API 仅返回当前认证用户自身的信息。",
          "GetUserContactDetails has been permanently removed for PII (privacy) reasons. The new Identity API only returns the authenticated user's own data — querying other users by ID is no longer supported."
        )}
      </div>

      <Section
        title={label("主な必要スコープ", "主要所需 Scope", "Key Required Scopes")}
      >
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-3">
            <span className="text-zinc-500 w-40 shrink-0">Identity API</span>
            <ScopeTag scope="https://api.ebay.com/oauth/api_scope/commerce.identity.readonly" />
          </div>
          <div className="flex items-start gap-3">
            <span className="text-zinc-500 w-40 shrink-0">Finances API</span>
            <ScopeTag scope="https://api.ebay.com/oauth/api_scope/sell.finances" />
          </div>
          <div className="flex items-start gap-3">
            <span className="text-zinc-500 w-40 shrink-0">Stores API</span>
            <ScopeTag scope="https://api.ebay.com/oauth/api_scope/sell.stores" />
          </div>
        </div>
      </Section>

      <Section
        title={tCommon("apiMappingTitle")}
        id="mapping"
      >
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
          {label(
            "▶ のある行をクリックすると旧コード（Trading API SOAP/XML）と新コード（各 REST API）を並べて確認できます。",
            "点击带 ▶ 的行可并排查看旧代码（Trading API SOAP/XML）和新代码（各 REST API）。",
            "Click rows with ▶ to compare old (Trading API SOAP/XML) and new (REST API) code side by side."
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
