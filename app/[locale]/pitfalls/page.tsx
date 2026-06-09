import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import PageLayout from "@/components/PageLayout";
import { pitfalls } from "@/data/pitfalls";
import { highlight } from "@/lib/highlight";
import CopyButton from "@/components/CopyButton";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const pitfallTitles: Record<string, Record<string, string>> = {
  "arrays-full-replace": { ja: "1. 配列フィールドは全置換（差分更新ではない）", en: "1. Arrays Are Fully Replaced (Not Patched)", zh: "1. 数组字段是全量替换（不是差量更新）" },
  "transaction-id-removed": { ja: "2. TransactionID は廃止", en: "2. TransactionID Is Gone", zh: "2. TransactionID 已废弃" },
  "verify-operation-mode": { ja: "3. Verify* 系コールは operationMode: VALIDATE に統合", en: "3. Verify* Calls Replaced by operationMode: VALIDATE", zh: "3. Verify* 系调用改为 operationMode: VALIDATE" },
  "paid-unpaid-split": { ja: "4. 支払済み・未払い注文は別クエリに分離", en: "4. Paid and Unpaid Orders Are Now Separate", zh: "4. 已付款和未付款订单已分离为不同查询" },
  "case-entity-removed": { ja: "5. Post-Order の Case エンティティは廃止", en: "5. Post-Order Case Entity No Longer Exists", zh: "5. Post-Order Case 实体已废除" },
  "site-id-to-marketplace-id": { ja: "6. Site ID → X-EBAY-C-MARKETPLACE-ID ヘッダーへ変更", en: "6. Site ID → X-EBAY-C-MARKETPLACE-ID Header", zh: "6. Site ID → X-EBAY-C-MARKETPLACE-ID 请求头" },
  "cursor-pagination": { ja: "7. オフセット → カーソルページネーションへ変更", en: "7. Offset Pagination → Cursor Pagination", zh: "7. 偏移量分页 → 游标分页" },
  "inventory-mapping-no-sandbox": { ja: "8. Inventory Mapping API はサンドボックス非対応", en: "8. Inventory Mapping API — No Sandbox Support", zh: "8. Inventory Mapping API 不支持沙盒环境" },
  "mapping-reference-id": { ja: "9. mappingReferenceId を createListing に渡す必要がある", en: "9. mappingReferenceId Must Be Passed to createListing", zh: "9. 必须将 mappingReferenceId 传递给 createListing" },
  "auth-scope-granularity": { ja: "10. OAuth スコープの粒度が細かくなった", en: "10. Auth Scope Granularity Is Much Higher", zh: "10. OAuth Scope 粒度更细" },
  "add-to-item-description-removed": { ja: "11. AddToItemDescription は移行なし", en: "11. AddToItemDescription Has No Replacement", zh: "11. AddToItemDescription 无替代方案" },
  "get-user-contact-details-removed": { ja: "12. GetUserContactDetails は永続削除", en: "12. GetUserContactDetails Is Permanently Removed", zh: "12. GetUserContactDetails 已永久删除" },
  "messaging-preferences-removed": { ja: "13. カスタム ASQ トピックとフォルダ管理は廃止", en: "13. Custom ASQ Topics and Folder Management Are Gone", zh: "13. 自定义 ASQ 话题和文件夹管理已废除" },
  "auction-restrictions": { ja: "14. オークションリスティングの変更制限", en: "14. Auction Listing Change Restrictions", zh: "14. 拍卖商品修改限制" },
  "graphql-partial-success": { ja: "15. GraphQL は部分成功に注意（data と errors が同時に返る）", en: "15. GraphQL Partial Success — Check Both data AND errors", zh: "15. GraphQL 部分成功 — 需同时检查 data 和 errors" },
  "item-commitments-two-level": { ja: "16. itemCommitments は 2 層構造（入力は sellerItemCommitments に渡す）", en: "16. itemCommitments Uses Two Levels — Pass Input to sellerItemCommitments", zh: "16. itemCommitments 是两层结构 — 参数传入 sellerItemCommitments" },
  "order-amount-field-names": { ja: "17. 注文金額のフィールド名変更（total → orderTotal / lineItemTotal）", en: "17. Order Amount Field Names Changed (total → orderTotal / lineItemTotal)", zh: "17. 订单金额字段名变更（total → orderTotal / lineItemTotal）" },
  "trading-order-status-completed": { ja: "18. Trading API の OrderStatus は 'Completed'（'Complete' ではない）", en: "18. Trading API OrderStatus Is 'Completed' Not 'Complete'", zh: "18. Trading API 的 OrderStatus 是 'Completed' 而非 'Complete'" },
  "trading-create-time-range-limit": { ja: "19. Trading API の CreateTimeFrom/CreateTimeTo は最大 90 日", en: "19. Trading API CreateTimeFrom/CreateTimeTo Max Range Is 90 Days", zh: "19. Trading API CreateTimeFrom/CreateTimeTo 最大范围为 90 天" },
  "seller-listings-input-and-union": { ja: "20. sellerListings の input と union レスポンス構造が変わった", en: "20. sellerListings Input Format and Response Union Have Changed", zh: "20. sellerListings 的 input 格式和 union 响应结构已变更" },
  "graphql-union-error-handling": { ja: "21. GraphQL union error は inline fragment で全て補足する", en: "21. Always Catch Every Union Error Type with Inline Fragments", zh: "21. 必须用 inline fragment 捕获所有 union error 类型" },
};

const pitfallDescriptions: Record<string, Record<string, string>> = {
  "arrays-full-replace": {
    ja: "updateListing で imageUrls や aspects などの配列フィールドを更新すると、送ったもので全て置き換わります。既存の値を残したい場合は全て含めて送ってください。",
    en: "When updating array fields like imageUrls or aspects in updateListing, the entire array is replaced with what you send. Include all existing values you want to keep.",
    zh: "在 updateListing 中更新 imageUrls、aspects 等数组字段时，会用发送的内容全量替换。如需保留现有值，请全部包含在请求中。",
  },
  "transaction-id-removed": {
    ja: "Trading API の TransactionID は新 API にまったく移行されていません。代わりに orderLineItemId（Order API では lineItemId）を使用してください。",
    en: "TransactionID from Trading API was not migrated to any new REST or GraphQL API. Use orderLineItemId (lineItemId in Order API) instead.",
    zh: "Trading API 的 TransactionID 完全未迁移到任何新 REST 或 GraphQL API。请改用 orderLineItemId（Order API 中为 lineItemId）。",
  },
  "paid-unpaid-split": {
    ja: "旧 GetOrders は支払済み・未払いを一度に返していましたが、新 API では完全分離。支払済み → orders クエリ、未払い → itemCommitments クエリ。orders クエリに未払い注文は返りません。",
    en: "Old GetOrders returned both paid and unpaid. New API splits them. Paid → orders query; Unpaid → itemCommitments query. They never appear in each other's results.",
    zh: "旧 GetOrders 同时返回已付款和未付款。新 API 完全分离。已付款 → orders 查询；未付款 → itemCommitments 查询。两者互不出现在对方的查询中。",
  },
  "case-entity-removed": {
    ja: "Post-Order API の Case エンティティは廃止。INR ケース → Order Inquiry API、返品ケース → Return API に統合。両クエリレスポンスにケース情報がインラインで含まれます。",
    en: "The Post-Order API 'Case' entity no longer exists. INR cases → Order Inquiry API; return cases → Return API. Case info is included inline in both query responses.",
    zh: "Post-Order API 的 Case 实体已废除。INR 案例 → Order Inquiry API；退货案例 → Return API。案例信息内联包含在两个查询的响应中。",
  },
  "inventory-mapping-no-sandbox": {
    ja: "Inventory Mapping API はサンドボックス環境に対応していません。テストには本番環境の開発者アカウントを使用してください。",
    en: "Inventory Mapping API is Production-only. Use a developer account in Production for testing. Sandbox is not supported.",
    zh: "Inventory Mapping API 仅支持生产环境，不支持沙盒。测试请使用生产环境的开发者账号。",
  },
  "mapping-reference-id": {
    ja: "Inventory Mapping API を使った場合、各 ListingPreview の mappingReferenceId を createListing の入力に必ず渡してください。AI 推薦と実際の出品を紐付けるために必要です。",
    en: "When using Inventory Mapping API, pass the mappingReferenceId from each ListingPreview into createListing. This links the AI recommendation to the live listing.",
    zh: "使用 Inventory Mapping API 时，必须将每个 ListingPreview 的 mappingReferenceId 传递给 createListing，用于关联 AI 推荐和实际商品。",
  },
  "auth-scope-granularity": {
    ja: "Trading API のブロードなスコープと異なり、新 API は機能別の細粒度スコープを使います。読み取り専用スコープで mutation を呼ぶと失敗します。",
    en: "Unlike Trading API's broad scopes, new APIs use fine-grained per-feature scopes. Using a read scope for write mutations will fail.",
    zh: "与 Trading API 的宽泛 Scope 不同，新 API 使用功能级细粒度 Scope。用只读 Scope 调用写入 mutation 会失败。",
  },
  "add-to-item-description-removed": {
    ja: "テキストを追記する AddToItemDescription は移行されていません。説明を変更する場合は updateListing で完全な新しい説明を送ってください。",
    en: "AddToItemDescription (which appended text) has no replacement. Use updateListing with the complete new description text.",
    zh: "用于追加文本的 AddToItemDescription 没有替代方案。如需修改描述，请使用 updateListing 发送完整的新描述文本。",
  },
  "get-user-contact-details-removed": {
    ja: "他ユーザーの個人情報（PII）を取得する GetUserContactDetails はプライバシー保護の観点から永続削除されました。新 API に同等の機能はありません。",
    en: "GetUserContactDetails retrieved PII for other eBay users. This capability is permanently removed for privacy/compliance reasons.",
    zh: "GetUserContactDetails 用于获取其他 eBay 用户的个人信息（PII）。因隐私/合规原因已永久删除，新 API 中没有等效功能。",
  },
  "messaging-preferences-removed": {
    ja: "GetMessagePreferences / SetMessagePreferences（カスタム ASQ トピック）および ReviseMyMessagesFolders（フォルダ管理）は新 API に移行されていません。",
    en: "GetMessagePreferences / SetMessagePreferences (custom ASQ topics) and ReviseMyMessagesFolders (folder management) have no replacements.",
    zh: "GetMessagePreferences / SetMessagePreferences（自定义 ASQ 话题）和 ReviseMyMessagesFolders（文件夹管理）在新 API 平台中均无替代方案。",
  },
  "auction-restrictions": {
    ja: "オークションリスティングは終了12時間以内は変更できません。固定価格リスティングも一度売れた後は一部の変更が制限されます。",
    en: "Auction listings cannot be changed within 12 hours of end time. Fixed price listings also have some change restrictions after one or more sales.",
    zh: "拍卖商品在结束前12小时内不能修改。固定价格商品在有销售记录后也有部分修改限制。",
  },
  "graphql-partial-success": {
    ja: "GraphQL は REST と異なり、data と errors が同時に返る「部分成功」があります。必ず failures / errors 配列も確認してください。",
    en: "Unlike REST, GraphQL mutations can return both data and errors simultaneously (partial success). Always check failures / errors arrays.",
    zh: "与 REST 不同，GraphQL mutation 可以同时返回 data 和 errors（部分成功）。必须始终检查 failures / errors 数组。",
  },
  "verify-operation-mode": {
    ja: "VerifyAddFixedPriceItem / VerifyAddItem などの Verify 系コールは、operationMode: VALIDATE オプションに統合されました。",
    en: "VerifyAddFixedPriceItem / VerifyAddItem and similar calls are replaced by the operationMode: VALIDATE option.",
    zh: "VerifyAddFixedPriceItem / VerifyAddItem 等 Verify 系调用已整合为 operationMode: VALIDATE 选项。",
  },
  "site-id-to-marketplace-id": {
    ja: "旧 Trading API の siteid パラメータ（例: 0 = US）は X-EBAY-C-MARKETPLACE-ID ヘッダー（例: EBAY_US）に変更されました。",
    en: "The old Trading API siteid parameter (e.g., 0 = US) is replaced by the X-EBAY-C-MARKETPLACE-ID header (e.g., EBAY_US).",
    zh: "旧 Trading API 的 siteid 参数（如 0 = US）已变更为 X-EBAY-C-MARKETPLACE-ID 请求头（如 EBAY_US）。",
  },
  "cursor-pagination": {
    ja: "オフセットページネーション（offset + limit）からカーソルページネーションに変更。カーソルは不透明な文字列なので計算・逆算はできません。また orders はルートに入力なし — sellerOrders(input:...) に渡す必要があります。",
    en: "Changed from offset-based (offset + limit) to cursor-based pagination. Cursors are opaque strings — do not try to calculate or reverse-engineer them. Note: orders takes no input at root — pass parameters to sellerOrders(input:...).",
    zh: "从偏移量分页（offset + limit）改为游标分页。游标是不透明字符串，不能计算或反推。注意：orders 根查询不接受输入 — 需将参数传入 sellerOrders(input:...)。",
  },
  "item-commitments-two-level": {
    ja: "itemCommitments ルートクエリは入力なし。パラメータは sellerItemCommitments(input:...) に渡す。さらに status → state、listingId → lineItem.item.itemId、quantity → lineItem.quantity、pageCursor → pagination.nextCursor と変更されています。",
    en: "The itemCommitments root query takes no input. Pass parameters to sellerItemCommitments(input:...). Also note: status → state, listingId → lineItem.item.itemId, quantity → lineItem.quantity, pageCursor → pagination.nextCursor.",
    zh: "itemCommitments 根查询不接受输入。需将参数传入 sellerItemCommitments(input:...)。另外：status → state，listingId → lineItem.item.itemId，quantity → lineItem.quantity，pageCursor → pagination.nextCursor。",
  },
  "order-amount-field-names": {
    ja: "OrderTotals の合計金額は total ではなく orderTotal。OrderLineItemTotals は total ではなく lineItemTotal。さらに AmountSet の値は value/currency 直アクセスではなく original { value currency } 経由になります。",
    en: "Order total is orderTotal (not total) on OrderTotals. Line item total is lineItemTotal (not total) on OrderLineItemTotals. AmountSet values are accessed via original { value currency }, not directly.",
    zh: "订单总金额在 OrderTotals 上是 orderTotal（不是 total）。订单明细金额在 OrderLineItemTotals 上是 lineItemTotal（不是 total）。AmountSet 的值通过 original { value currency } 访问，而非直接访问。",
  },
  "trading-order-status-completed": {
    ja: "Trading API GetOrders の OrderStatus で支払済み注文を取得する場合、正しい値は 'Completed' です（'Complete' ではありません）。'Complete' を指定すると結果が返りません。",
    en: "When filtering paid orders with Trading API GetOrders, the correct OrderStatus value is 'Completed' (not 'Complete'). Using 'Complete' returns no results.",
    zh: "在 Trading API GetOrders 中筛选已付款订单时，正确的 OrderStatus 值是 'Completed'（不是 'Complete'）。使用 'Complete' 将返回空结果。",
  },
  "trading-create-time-range-limit": {
    ja: "Trading API GetOrders の CreateTimeFrom/CreateTimeTo で指定できる最大範囲は 90 日です。1年分などの長い期間は分割して複数回呼び出す必要があります。",
    en: "The max date range for CreateTimeFrom/CreateTimeTo in Trading API GetOrders is 90 days. For longer periods, split into multiple calls with non-overlapping 90-day windows.",
    zh: "Trading API GetOrders 中 CreateTimeFrom/CreateTimeTo 的最大日期范围为 90 天。如需较长时间段，需拆分为多个不超过 90 天的调用。",
  },
  "seller-listings-input-and-union": {
    ja: "sellerListings の input は { listingIds: [...] } ではなく { listings: [{ listingId: \"...\" }] } です。レスポンスは ListingsSuccess | ListingIdsMaxLimitError の union で、各リスティングも ListingSuccess | ListingPartialSuccess の union になりました。現在 listingId は最大1件。sell.listing スコープが read/write 統合されました。",
    en: "sellerListings input is { listings: [{ listingId: \"...\" }] } NOT { listingIds: [...] }. The response is a union of ListingsSuccess | ListingIdsMaxLimitError, and each listing entry is ListingSuccess | ListingPartialSuccess. Currently max 1 listingId per call. sell.listing scope now covers both read and write.",
    zh: "sellerListings 的 input 是 { listings: [{ listingId: \"...\" }] } 而非 { listingIds: [...] }。响应是 ListingsSuccess | ListingIdsMaxLimitError 的 union，每个商品条目是 ListingSuccess | ListingPartialSuccess 的 union。当前每次请求最多1个 listingId。sell.listing scope 现已合并读写权限。",
  },
  "graphql-union-error-handling": {
    ja: "GraphQL mutation の返り値が union 型の場合、エラー型の inline fragment を省略すると失敗時に null が返りサイレントに失敗します。必ず全ての union member に対して ... on ErrorType { errorCode errorMessage } を書いてください。",
    en: "When a GraphQL mutation returns a union type, omitting error inline fragments causes silent failures — null is returned without any indication of what went wrong. Always write ... on ErrorType { errorCode errorMessage } for every union member.",
    zh: "当 GraphQL mutation 的返回值为 union 类型时，省略错误类型的 inline fragment 会导致静默失败 — 返回 null 而没有任何错误提示。必须为所有 union 成员编写 ... on ErrorType { errorCode errorMessage }。",
  },
};

export default async function PitfallsPage({
  params,
}: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pitfalls");

  // Pre-highlight all code examples
  const highlightedPitfalls = await Promise.all(
    pitfalls.map(async (pitfall) => {
      if (!pitfall.codeExample) return { ...pitfall, badHtml: null, goodHtml: null };
      const [badHtml, goodHtml] = await Promise.all([
        pitfall.codeExample.bad ? highlight(pitfall.codeExample.bad, pitfall.codeExample.lang) : Promise.resolve(null),
        highlight(pitfall.codeExample.good, pitfall.codeExample.lang),
      ]);
      return { ...pitfall, badHtml, goodHtml };
    })
  );

  return (
    <PageLayout title={t("title")} subtitle={t("subtitle")} badge="Common Pitfalls">
      <div className="space-y-8">
        {highlightedPitfalls.map((pitfall) => {
          const title = pitfallTitles[pitfall.id]?.[locale] ?? pitfallTitles[pitfall.id]?.["en"] ?? pitfall.id;
          const desc = pitfallDescriptions[pitfall.id]?.[locale] ?? pitfallDescriptions[pitfall.id]?.["en"] ?? "";

          return (
            <div
              key={pitfall.id}
              id={pitfall.id}
              className={`rounded-xl border overflow-hidden ${
                pitfall.severity === "high"
                  ? "border-red-200 dark:border-red-800"
                  : "border-amber-200 dark:border-amber-800"
              }`}
            >
              <div className={`px-5 py-3 flex items-center justify-between ${
                pitfall.severity === "high"
                  ? "bg-red-50 dark:bg-red-950/30"
                  : "bg-amber-50 dark:bg-amber-950/30"
              }`}>
                <h2 className="font-bold text-zinc-900 dark:text-white">{title}</h2>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  pitfall.severity === "high"
                    ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                    : "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
                }`}>
                  {pitfall.severity === "high" ? t("severityHigh") : t("severityMedium")}
                </span>
              </div>

              <div className="px-5 py-4 bg-white dark:bg-zinc-900 space-y-4">
                {desc && <p className="text-sm text-zinc-600 dark:text-zinc-400">{desc}</p>}
                {pitfall.codeExample && (
                  <div className="space-y-3">
                    {pitfall.badHtml && (
                      <div>
                        <p className="text-xs font-semibold text-red-600 mb-1.5">❌ NG</p>
                        <div className="relative rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                          <div dangerouslySetInnerHTML={{ __html: pitfall.badHtml }} />
                          <CopyButton code={pitfall.codeExample.bad ?? ""} />
                        </div>
                      </div>
                    )}
                    {pitfall.goodHtml && (
                      <div>
                        {pitfall.badHtml && <p className="text-xs font-semibold text-green-600 mb-1.5">✅ OK</p>}
                        <div className="relative rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                          <div dangerouslySetInnerHTML={{ __html: pitfall.goodHtml }} />
                          <CopyButton code={pitfall.codeExample.good} />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </PageLayout>
  );
}
