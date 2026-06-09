import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import PageLayout, { Section, ScopeTag } from "@/components/PageLayout";
import { SideBySideCodeTabs, type OldNewTab } from "@/components/CodeTabs";
import { authExamples } from "@/data/code-examples/auth";
import { highlight } from "@/lib/highlight";
import type { Lang } from "@/components/CodeTabs";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const LANGS: Lang[] = ["php", "ruby", "java", "nodejs", "go", "python"];

export default async function GettingStartedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("gettingStarted");
  const tCommon = await getTranslations("common");

  const overviewItems = t.raw("sections.overview.items") as string[];
  const authSteps = t.raw("sections.auth.steps") as string[];
  const scopes = t.raw("sections.scopes.items") as Array<{ scope: string; use: string; grant: string }>;
  const marketplaceIds = t.raw("sections.headers.marketplaceIds") as Array<{ old: string; new: string; market: string }>;

  // Pre-highlight auth examples server-side
  const authTabs: OldNewTab[] = await Promise.all(
    LANGS.map(async (lang) => {
      const [oldHtml, newHtml] = await Promise.all([
        highlight(authExamples[lang].old, lang),
        highlight(authExamples[lang].new, lang),
      ]);
      return { lang, oldHtml, newHtml, oldRaw: authExamples[lang].old, newRaw: authExamples[lang].new };
    })
  );

  // Pre-highlight header comparison snippets
  const [oldHeaderHtml, newHeaderHtml] = await Promise.all([
    highlight(
      `POST https://api.ebay.com/ws/api.dll\nX-EBAY-API-SITEID: 0\nX-EBAY-API-COMPATIBILITY-LEVEL: 967\nX-EBAY-API-CALL-NAME: GetItem\nContent-Type: text/xml`,
      "http"
    ),
    highlight(
      `GET https://api.ebay.com/sell/fulfillment/v1/order\nAuthorization: Bearer {access_token}\nX-EBAY-C-MARKETPLACE-ID: EBAY_US\nContent-Type: application/json`,
      "http"
    ),
  ]);

  const listingApiHeaderHtml = await highlight(
    `# GraphQL Listing API: marketplace は input フィールドで指定\nmutation {\n  createListing(input: {\n    marketplace: EBAY_US   # ← ヘッダーではなく input フィールド\n    product: { ... }\n  }) { listingId }\n}`,
    "graphql"
  );

  return (
    <PageLayout title={t("title")} subtitle={t("subtitle")} badge="Getting Started">
      {/* Overview */}
      <Section title={t("sections.overview.title")} id="overview">
        <ul className="space-y-2">
          {overviewItems.map((item, i) => (
            <li key={i} className="flex gap-3 text-zinc-700 dark:text-zinc-300">
              <span className="text-blue-500 mt-0.5 shrink-0">✓</span>
              <span dangerouslySetInnerHTML={{ __html: item.replace(/`([^`]+)`/g, '<code class="font-mono text-sm bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">$1</code>') }} />
            </li>
          ))}
        </ul>
      </Section>

      {/* Authentication */}
      <Section title={t("sections.auth.title")} id="auth">
        <p className="text-zinc-600 dark:text-zinc-400">{t("sections.auth.description")}</p>
        <ol className="space-y-2 mt-3">
          {authSteps.map((step, i) => (
            <li key={i} className="flex gap-3 text-zinc-700 dark:text-zinc-300">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
                {i + 1}
              </span>
              <span className="mt-0.5">{step}</span>
            </li>
          ))}
        </ol>
        <div className="mt-6">
          <SideBySideCodeTabs tabs={authTabs} oldLabel={tCommon("viewOldCode")} newLabel={tCommon("viewNewCode")} />
        </div>
      </Section>

      {/* OAuth Scopes */}
      <Section title={t("sections.scopes.title")} id="scopes">
        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-700">
          <table className="min-w-full text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-800">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-300">Scope</th>
                <th className="px-4 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-300">
                  {locale === "ja" ? "用途" : locale === "zh" ? "用途" : "Use"}
                </th>
                <th className="px-4 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-300">Grant Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {scopes.map((scope, i) => (
                <tr key={i} className="bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <td className="px-4 py-3 font-mono text-xs text-zinc-600 dark:text-zinc-300 break-all">{scope.scope}</td>
                  <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300 text-xs">{scope.use}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                      scope.grant === "Client Credentials"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                    }`}>
                      {scope.grant}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Header Changes */}
      <Section title={t("sections.headers.title")} id="headers">
        <p className="text-zinc-600 dark:text-zinc-400">{t("sections.headers.description")}</p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-700">
          <table className="min-w-full text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-800">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-300">
                  {locale === "ja" ? "旧 siteid" : locale === "zh" ? "旧 siteid" : "Old siteid"}
                </th>
                <th className="px-4 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-300">X-EBAY-C-MARKETPLACE-ID</th>
                <th className="px-4 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-300">
                  {locale === "ja" ? "マーケット" : locale === "zh" ? "市场" : "Market"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {marketplaceIds.map((row, i) => (
                <tr key={i} className="bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <td className="px-4 py-3 font-mono text-zinc-700 dark:text-zinc-300">{row.old}</td>
                  <td className="px-4 py-3 font-mono text-blue-700 dark:text-blue-400 font-semibold">{row.new}</td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{row.market}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Before/After header comparison */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-red-600 mb-2">
              ❌ {locale === "ja" ? "旧" : locale === "zh" ? "旧" : "Old"} (Trading API)
            </p>
            <div className="relative rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
              <div dangerouslySetInnerHTML={{ __html: oldHeaderHtml }} />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-green-600 mb-2">
              ✅ {locale === "ja" ? "新" : locale === "zh" ? "新" : "New"} (REST API)
            </p>
            <div className="relative rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
              <div dangerouslySetInnerHTML={{ __html: newHeaderHtml }} />
            </div>
          </div>
        </div>

        {/* GraphQL Listing API marketplace note */}
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="font-semibold text-blue-800 dark:text-blue-300 text-sm mb-2">
            ℹ️ {locale === "ja"
              ? "GraphQL Listing API のマーケットプレイス指定"
              : locale === "zh"
              ? "GraphQL Listing API 的 Marketplace 指定方式"
              : "GraphQL Listing API — Marketplace Specification"}
          </p>
          <p className="text-blue-700 dark:text-blue-400 text-xs leading-relaxed mb-3">
            {locale === "ja"
              ? "GraphQL Listing API（createListing 等）では X-EBAY-C-MARKETPLACE-ID ヘッダーではなく、mutation の input フィールドで marketplace を指定します。REST API（Fulfillment API 等）では引き続きヘッダーを使用します。"
              : locale === "zh"
              ? "GraphQL Listing API（createListing 等）不使用 X-EBAY-C-MARKETPLACE-ID 请求头，而是通过 mutation 的 input 字段指定 marketplace。REST API（如 Fulfillment API）仍然使用请求头。"
              : "For GraphQL Listing API (createListing etc.), marketplace is specified as an input field in the mutation — not via the X-EBAY-C-MARKETPLACE-ID header. REST APIs continue to use the header."}
          </p>
          <div className="relative rounded-lg overflow-hidden border border-blue-200 dark:border-blue-800">
            <div dangerouslySetInnerHTML={{ __html: listingApiHeaderHtml }} />
          </div>
        </div>
      </Section>

      <Section
        title={locale === "ja" ? "サンドボックス環境でのテスト" : locale === "zh" ? "沙盒环境测试" : "Testing in Sandbox"}
        id="sandbox"
      >
        <div className="space-y-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {locale === "ja"
              ? "新しい API コードを本番に適用する前に、サンドボックス環境でテストすることを推奨します。サンドボックスと本番では URL が異なります。"
              : locale === "zh"
              ? "在将新 API 代码应用于生产环境之前，建议先在沙盒环境中测试。沙盒和生产环境的 URL 不同。"
              : "Test your new API code in the Sandbox environment before applying to Production. URLs differ between environments."}
          </p>

          <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-700">
            <table className="min-w-[540px] w-full text-sm">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
                  <th className="px-4 py-2 text-left font-semibold text-zinc-600 dark:text-zinc-300">
                    {locale === "ja" ? "API 種別" : locale === "zh" ? "API 类型" : "API Type"}
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-zinc-600 dark:text-zinc-300">
                    {locale === "ja" ? "本番 (Production)" : locale === "zh" ? "生产 (Production)" : "Production"}
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-zinc-600 dark:text-zinc-300">
                    {locale === "ja" ? "サンドボックス (Sandbox)" : locale === "zh" ? "沙盒 (Sandbox)" : "Sandbox"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {[
                  { type: "Trading API", prod: "api.ebay.com/ws/api.dll", sandbox: "api.sandbox.ebay.com/ws/api.dll" },
                  { type: "GraphQL API", prod: "graphqlapi.ebay.com/graphql", sandbox: "graphqlapi.sandbox.ebay.com/graphql" },
                  { type: "REST API (sell/*)", prod: "api.ebay.com/sell/...", sandbox: "api.sandbox.ebay.com/sell/..." },
                  { type: "REST API (commerce/*)", prod: "api.ebay.com/commerce/...", sandbox: "api.sandbox.ebay.com/commerce/..." },
                  { type: "Finances API", prod: "apiz.ebay.com/sell/finances/...", sandbox: "apiz.sandbox.ebay.com/sell/finances/..." },
                  { type: "Identity API", prod: "apiz.ebay.com/commerce/identity/...", sandbox: "apiz.sandbox.ebay.com/commerce/identity/..." },
                ].map(({ type, prod, sandbox }) => (
                  <tr key={type} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <td className="px-4 py-2 font-medium text-zinc-700 dark:text-zinc-300">{type}</td>
                    <td className="px-4 py-2 font-mono text-xs text-green-700 dark:text-green-400">{prod}</td>
                    <td className="px-4 py-2 font-mono text-xs text-amber-700 dark:text-amber-400">{sandbox}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-800 dark:text-amber-300">
            ⚠️{" "}
            {locale === "ja"
              ? "以下の API はサンドボックス非対応です: Inventory Mapping API・Catalog API (product_summary/search)・Taxonomy API の getCategorySuggestions。これらは本番環境の開発者アカウントで直接テストしてください。"
              : locale === "zh"
              ? "以下 API 不支持沙盒环境：Inventory Mapping API、Catalog API (product_summary/search)、Taxonomy API 的 getCategorySuggestions。请直接使用生产环境的开发者账号进行测试。"
              : "The following APIs do NOT support Sandbox: Inventory Mapping API, Catalog API (product_summary/search), Taxonomy API getCategorySuggestions. Test these directly with a developer account in Production."}
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl text-sm text-blue-800 dark:text-blue-300 space-y-2">
            <p>
              ℹ️{" "}
              {locale === "ja"
                ? "サンドボックス用の OAuth トークンは本番とは別に取得する必要があります。"
                : locale === "zh"
                ? "沙盒 OAuth Token 需单独获取，与生产环境分开。"
                : "Sandbox OAuth tokens must be obtained separately from Production."}
            </p>
            <ul className="list-disc list-inside space-y-1 ml-1">
              <li>
                <a
                  href="https://developer.ebay.com/my/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:opacity-80"
                >
                  {locale === "ja" ? "eBay Developer Program → App Keys でサンドボックス用キーを作成" : locale === "zh" ? "eBay Developer Program → App Keys 创建沙盒密钥" : "eBay Developer Program → App Keys — create Sandbox keys"}
                </a>
              </li>
              <li>
                {locale === "ja" ? "トークン取得エンドポイント: " : locale === "zh" ? "Token 获取端点: " : "Token endpoint: "}
                <code className="font-mono text-xs bg-blue-100 dark:bg-blue-900/50 px-1 py-0.5 rounded">
                  https://api.sandbox.ebay.com/identity/v1/oauth2/token
                </code>
              </li>
              <li>
                <a
                  href="https://developer.ebay.com/api-docs/static/oauth-authorization-code-grant.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:opacity-80"
                >
                  {locale === "ja" ? "OAuth Authorization Code Grant フロー ドキュメント" : locale === "zh" ? "OAuth Authorization Code Grant 流程文档" : "OAuth Authorization Code Grant Flow documentation"}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
