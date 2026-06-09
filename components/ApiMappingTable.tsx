import { useTranslations } from "next-intl";
import type { MappingRow, ApiType } from "@/data/api-mapping";

const typeBadge: Record<ApiType, string> = {
  graphql: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  rest: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "not-migrated": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

function TypeBadge({ type, labels }: { type: ApiType; labels: Record<ApiType, string> }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${typeBadge[type]}`}>
      {labels[type]}
    </span>
  );
}

export default function ApiMappingTable({ rows }: { rows: MappingRow[] }) {
  const t = useTranslations("common");
  const typeLabels: Record<ApiType, string> = {
    graphql: t("graphql"),
    rest: t("rest"),
    "not-migrated": t("notMigrated"),
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-700">
      <table className="min-w-[560px] w-full text-sm">
        <thead className="bg-zinc-50 dark:bg-zinc-800">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-300 w-[30%]">{t("oldApi")}</th>
            <th className="px-4 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-300 w-[35%]">{t("newApi")}</th>
            <th className="px-4 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-300 w-20">{t("type")}</th>
            <th className="px-4 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-300">{t("notes")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
          {rows.map((row, i) => (
            <tr
              key={i}
              className={`${
                row.type === "not-migrated"
                  ? "bg-red-50 dark:bg-red-950/20"
                  : "bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
              } transition-colors`}
            >
              <td className="px-4 py-3 font-mono text-xs text-zinc-700 dark:text-zinc-300 align-top break-all">{row.oldApi}</td>
              <td className="px-4 py-3 font-mono text-xs text-zinc-700 dark:text-zinc-300 align-top break-all">
                {row.type === "not-migrated" ? "—" : row.newOperation}
              </td>
              <td className="px-4 py-3 align-top">
                <TypeBadge type={row.type} labels={typeLabels} />
              </td>
              <td className="px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400 align-top">{row.notes ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
