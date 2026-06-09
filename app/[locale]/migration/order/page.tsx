import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import PageLayout, { Section, ScopeTag } from "@/components/PageLayout";
import ExpandableApiTable, { type HighlightedSnippet } from "@/components/ExpandableApiTable";
import { orderPaidMapping, orderUnpaidMapping, orderInvoiceMapping } from "@/data/api-mapping";
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

export default async function OrderPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("migration.order");

  const paidRows = await Promise.all(
    orderPaidMapping.rows.map(async (row) => {
      const raw = snippetByOldApi[row.oldApi];
      if (!raw) return row;
      return { ...row, snippet: await preHighlight(raw) };
    })
  );

  const unpaidRows = await Promise.all(
    orderUnpaidMapping.rows.map(async (row) => {
      const raw = snippetByOldApi[row.oldApi];
      if (!raw) return row;
      return { ...row, snippet: await preHighlight(raw) };
    })
  );

  const invoiceRows = await Promise.all(
    orderInvoiceMapping.rows.map(async (row) => {
      const raw = snippetByOldApi[row.oldApi];
      if (!raw) return row;
      return { ...row, snippet: await preHighlight(raw) };
    })
  );

  const label = (ja: string, zh: string, en: string) =>
    locale === "ja" ? ja : locale === "zh" ? zh : en;

  const cursorExample = `# 次ページ: 前レスポンスの nextCursor をそのまま渡す
# orders は入力なし → sellerOrders(input:...) にページ情報を渡す
query {
  orders {
    sellerOrders(input: {
      ordersPage: {
        maxPageSize: 20
        pageCursor: "eyJza2lwIjoyMH0="  # 前レスポンスから取得（計算不可）
      }
    }) {
      orders { orderId }
      pagination { nextCursor previousCursor }
    }
  }
}`;

  return (
    <PageLayout title={t("title")} subtitle={t("subtitle")} badge="Migration Guide">
      <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-800 dark:text-red-300">
        <strong>⚠️ {label("重要な変更", "重要变更", "Important Change")}:</strong>{" "}
        {label(
          "旧 GetOrders は支払済み・未払いの両方を返していましたが、新 API では完全に分離されました。支払済み → orders クエリ、未払い → itemCommitments クエリを使い分けてください。",
          "旧 GetOrders 同时返回已付款和未付款订单，但新 API 已完全分离。已付款 → orders 查询，未付款 → itemCommitments 查询。",
          "Old GetOrders returned both paid and unpaid orders. New APIs split them: Paid → orders query; Unpaid → itemCommitments query."
        )}
      </div>

      <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-800 dark:text-amber-300">
        <strong>🔑 TransactionID:</strong>{" "}
        {label(
          "TransactionID は新 API に移行されていません。代わりに orderLineItemId（lineItemId）を使用してください。",
          "TransactionID 未迁移到新 API。请改用 orderLineItemId（lineItemId）。",
          "TransactionID was NOT migrated. Use orderLineItemId (lineItemId) instead."
        )}
      </div>

      <Section title={label("必要な OAuth スコープ", "所需 OAuth Scope", "Required OAuth Scope")}>
        <ScopeTag scope="https://api.ebay.com/oauth/api_scope/sell.fulfillment" />
      </Section>

      <Section title={label("支払済み注文", "已付款订单", "Paid Orders")} id="paid">
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
          {label("▶ 行をクリックすると旧コードと新コードを並べて確認できます。", "点击 ▶ 行并排查看旧代码和新代码。", "Click ▶ rows to compare old and new code side by side.")}
        </p>
        <ExpandableApiTable rows={paidRows} />
      </Section>

      <Section title={label("未払い注文", "未付款订单", "Unpaid Orders")} id="unpaid">
        <ExpandableApiTable rows={unpaidRows} />
      </Section>

      <Section title={label("請求書・Purchase Quote", "发票 / Purchase Quote", "Invoice / Purchase Quote")} id="invoice">
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
          {label(
            "▶ 行をクリックすると旧コードと新コードを並べて確認できます。",
            "点击 ▶ 行并排查看旧代码和新代码。",
            "Click ▶ rows to compare old and new code side by side."
          )}
        </p>
        <ExpandableApiTable rows={invoiceRows} />
      </Section>

      <Section title={label("カーソルページネーション", "游标分页", "Cursor Pagination")} id="pagination">
        <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-3">
          {label(
            "オフセット方式（offset + limit）からカーソル方式に変更。カーソルは不透明な文字列です。計算や逆算はできません。",
            "从偏移量分页改为游标分页。游标是不透明字符串，不能计算或反推。",
            "Changed from offset-based to cursor-based pagination. Cursors are opaque strings — do not calculate or reverse-engineer them."
          )}
        </p>
        <CodeBlock code={cursorExample} lang="graphql" />
      </Section>
    </PageLayout>
  );
}
