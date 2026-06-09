import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import PageLayout, { Section, ScopeTag } from "@/components/PageLayout";
import ExpandableApiTable, { type HighlightedSnippet } from "@/components/ExpandableApiTable";
import { listingMapping } from "@/data/api-mapping";
import { snippetByOldApi } from "@/data/code-examples/listing-calls";
import { highlight } from "@/lib/highlight";
import CodeBlock from "@/components/CodeBlock";
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

export default async function ListingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("migration.listing");

  // Pre-highlight all snippets server-side
  const rows = await Promise.all(
    listingMapping.rows.map(async (row) => {
      const raw = snippetByOldApi[row.oldApi];
      if (!raw) return row;
      return { ...row, snippet: await preHighlight(raw) };
    })
  );

  const label = (ja: string, zh: string, en: string) =>
    locale === "ja" ? ja : locale === "zh" ? zh : en;

  const graphqlExample = `mutation {
  createListing(input: {
    marketplace: EBAY_US
    product: {
      title: "Apple iPhone 15 Pro Max 256GB"
      description: "<p>Brand new, factory sealed.</p>"
      categories: { primary: { id: "9355" } }
      imageUrls: ["https://i.ebayimg.com/s-l1600.jpg"]
      itemCondition: { conditionId: "1000" }
      aspects: [
        { name: "Brand", values: ["Apple"] }
        { name: "Model", values: ["iPhone 15 Pro Max"] }
      ]
    }
    items: [{
      price: { value: "1199.00", currency: USD }
      quantity: 5
    }]
    terms: {
      listingFormat: FIXED_PRICE
      listingDurationInDays: 30
      fulfillmentTerms: { shippingTerms: { fulfillmentPolicyId: "POLICY_ID" } }
      returnTerms: { returnPolicyId: "POLICY_ID" }
      paymentTerms: { paymentPolicyId: "POLICY_ID" }
    }
  }) {
    listingId
    errors { errorId message }
  }
}`;

  const validateExample = `mutation {
  createListing(input: {
    options: { operationMode: VALIDATE }
    marketplace: EBAY_US
    product: { title: "..." }
    items: [{ price: { value: "99.00", currency: USD } quantity: 1 }]
    terms: { listingFormat: FIXED_PRICE listingDurationInDays: 30 }
  }) {
    errors { errorId message parameters { name value } }
    warnings { warningId message }
  }
}`;

  const updateExample = `mutation {
  updateListing(input: {
    listingIdentifier: { listingId: "123456789" }
    items: [{
      price: { value: "999.00", currency: USD }
      quantity: 3
    }]
    # 注意: imageUrls などの配列は差分ではなく全置換
  }) {
    listingId
    errors { errorId message }
  }
}`;

  return (
    <PageLayout title={t("title")} subtitle={t("subtitle")} badge="Migration Guide">
      <Section title={label("必要な OAuth スコープ", "所需 OAuth Scope", "Required OAuth Scope")}>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-500 w-40 shrink-0">
              {label("読み取り・書き込み", "读取/写入", "Read & Write")}
            </span>
            <ScopeTag scope={t("scope")} />
          </div>
        </div>
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
          {label(
            "sell.listing は read/write 両対応になりました。sell.listing.read は不要です。",
            "sell.listing 现已同时支持读取和写入权限，不再需要单独的 sell.listing.read。",
            "sell.listing now covers both read and write permissions. sell.listing.read is no longer required."
          )}
        </p>
      </Section>

      <Section title={label("API 対応表", "API 对应表", "API Mapping")} id="mapping">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {label(
            "▶ のある行をクリックすると旧コード（SOAP/XML）と新コード（GraphQL）を並べて確認できます。",
            "点击带 ▶ 的行可并排查看旧代码（SOAP/XML）和新代码（GraphQL）。",
            "Click rows with ▶ to compare old (SOAP/XML) and new (GraphQL) code side by side."
          )}
        </p>
        <ExpandableApiTable rows={rows} />
      </Section>

      <Section title={label("createListing — 出品作成", "createListing — 创建商品", "createListing — Create Listing")} id="create">
        <CodeBlock code={graphqlExample} lang="graphql" />
      </Section>

      <Section title={label("VALIDATE モード（VerifyAddItem の代替）", "VALIDATE 模式（替代 VerifyAddItem）", "VALIDATE Mode (replaces VerifyAddItem)")} id="validate">
        <CodeBlock code={validateExample} lang="graphql" />
      </Section>

      <Section title={label("updateListing — 配列は全置換", "updateListing — 数组全量替换", "updateListing — Arrays Are Fully Replaced")} id="update">
        <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-800 dark:text-amber-300 mb-3">
          ⚠️ {label(
            "imageUrls や aspects などの配列フィールドは全置換です。既存の値を残したい場合は全て含めて送ってください。",
            "imageUrls、aspects 等数组字段是全量替换。如需保留现有值，请全部包含在请求中。",
            "Array fields like imageUrls and aspects are fully replaced. Include all values you want to keep."
          )}
        </div>
        <CodeBlock code={updateExample} lang="graphql" />
      </Section>
    </PageLayout>
  );
}
