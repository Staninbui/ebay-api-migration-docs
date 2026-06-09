import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import PageLayout, { Section } from "@/components/PageLayout";
import { notMigratedApis } from "@/data/not-migrated";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const alternativeMessages: Record<string, Record<string, string>> = {
  useUpdateListing: {
    ja: "updateListing で完全な新しい説明を送ってください（テキスト追記は不可）",
    en: "Use updateListing with the complete new description (text appending is not possible)",
    zh: "使用 updateListing 发送完整的新描述（不支持追加文本）",
  },
  templatesSunset: {
    ja: "Listing Designer テンプレートは提供終了。テンプレート機能は新 API にありません。",
    en: "Listing Designer templates are sunset. No template feature exists in new APIs.",
    zh: "Listing Designer 模板已停止服务，新 API 中没有模板功能。",
  },
  piiRemoved: {
    ja: "PII 保護・プライバシーコンプライアンスにより永続削除。代替なし。",
    en: "Permanently removed for PII protection and privacy compliance. No alternative.",
    zh: "因 PII 保护和隐私合规已永久删除。无替代方案。",
  },
  asqTopicsRemoved: {
    ja: "カスタム ASQ トピックは廃止。代替 API なし。",
    en: "Custom ASQ topics are no longer supported. No replacement API.",
    zh: "自定义 ASQ 话题不再支持。无替代 API。",
  },
  folderManagementRemoved: {
    ja: "eBay InBox フォルダ管理 API は廃止。代替 API なし。",
    en: "eBay InBox folder management API is removed. No replacement.",
    zh: "eBay InBox 文件夹管理 API 已删除。无替代方案。",
  },
  eligibilityViaError: {
    ja: "キャンセル不可の場合はビジネスエラーが返されます。事前チェック API はありません。",
    en: "A business error is returned if cancellation is ineligible. No pre-check API exists.",
    zh: "如不符合取消条件，会返回业务错误。不存在预检查 API。",
  },
};

const categoryLabels: Record<string, Record<string, string>> = {
  listing: { ja: "出品管理", en: "Listing Management", zh: "商品管理" },
  account: { ja: "アカウント管理", en: "Account Management", zh: "账户管理" },
  messaging: { ja: "メッセージング", en: "Messaging", zh: "消息" },
  cancellation: { ja: "キャンセル", en: "Cancellation", zh: "取消订单" },
};

export default async function NotMigratedPage({
  params,
}: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("notMigrated");

  const grouped = notMigratedApis.reduce(
    (acc, api) => {
      if (!acc[api.category]) acc[api.category] = [];
      acc[api.category].push(api);
      return acc;
    },
    {} as Record<string, typeof notMigratedApis>
  );

  return (
    <PageLayout title={t("title")} subtitle={t("subtitle")} badge="Not Migrated">
      <p className="text-zinc-600 dark:text-zinc-400">{t("description")}</p>

      {Object.entries(grouped).map(([category, apis]) => (
        <Section
          key={category}
          title={categoryLabels[category]?.[locale] ?? categoryLabels[category]?.["en"] ?? category}
          id={category}
        >
          <div className="space-y-3">
            {apis.map((api) => (
              <div
                key={api.id}
                className="flex gap-4 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg"
              >
                <span className="text-red-500 text-lg shrink-0">✗</span>
                <div>
                  <p className="font-mono text-sm font-semibold text-zinc-800 dark:text-zinc-200">{api.oldApi}</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                    {alternativeMessages[api.alternativeKey]?.[locale] ??
                      alternativeMessages[api.alternativeKey]?.["en"] ?? ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      ))}
    </PageLayout>
  );
}
